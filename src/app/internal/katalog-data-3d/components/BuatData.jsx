'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    LinearProgress,
    Grid,
    Card,
    CardMedia,
    Paper,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';

const STAGE_LABELS = {
    loading: 'Memuat foto',
    solve: 'Mencari pose kamera (SfM)',
    seed: 'Menyiapkan gaussian',
    training: 'Melatih splat',
};

const QUALITY_PRESETS = {
    draft: { label: 'Draft (cepat)', maxIters: 8000 },
    showcase: { label: 'Showcase (penuh)', maxIters: 40000 },
};

export default function BuatData3DModal({ isOpen, onClose, onComplete }) {
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [quality, setQuality] = useState('draft');
    const [phase, setPhase] = useState('idle'); // idle | running | done | error
    const [stage, setStage] = useState(null); // { stage, done, total, detail }
    const [metrics, setMetrics] = useState(null); // { iter, splats, itersPerSec, psnrTrain }
    const [errorMsg, setErrorMsg] = useState(null);
    const [resultBlob, setResultBlob] = useState(null);
    const [gpuSupported, setGpuSupported] = useState(true);

    const canvasRef = useRef(null);
    const sessionRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && !navigator.gpu) {
            setGpuSupported(false);
        }
    }, []);

    // Bersihkan object URL thumbnail saat komponen unmount / file berganti
    useEffect(() => {
        return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    }, [previews]);

    const resetAll = useCallback(() => {
        sessionRef.current = null;
        setFiles([]);
        setPreviews([]);
        setPhase('idle');
        setStage(null);
        setMetrics(null);
        setErrorMsg(null);
        setResultBlob(null);
    }, []);

    const handleClose = useCallback(() => {
        resetAll();
        onClose?.();
    }, [onClose, resetAll]);

    const addFiles = useCallback((incoming) => {
        const list = Array.from(incoming).filter((f) => f.type.startsWith('image/'));
        if (list.length === 0) return;
        setFiles((prev) => [...prev, ...list]);
        setPreviews((prev) => [
            ...prev,
            ...list.map((f) => ({ url: URL.createObjectURL(f), name: f.name })),
        ]);
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
        },
        [addFiles]
    );

    const removeFile = useCallback((index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    }, []);

    const handleStart = useCallback(async () => {
        if (files.length < 3) {
            setErrorMsg('Minimal butuh beberapa foto yang saling bertampalan (idealnya 20–200).');
            return;
        }
        setPhase('running');
        setErrorMsg(null);

        try {
            const { createSession } = await import('gsplat');

            const session = createSession({ maxIters: QUALITY_PRESETS[quality].maxIters });
            sessionRef.current = session;

            session.on('stage', (e) => setStage(e));
            session.on('metrics', (e) => setMetrics(e));

            await session.load(files);
            await session.solve();
            await session.seed();

            if (canvasRef.current) {
                session.view.attach(canvasRef.current);
            }

            session.start();

            await waitForTrainingDone(session);

            const ply = await session.exportPlyBlob();
            setResultBlob(ply);
            setPhase('done');
        } catch (err) {
            console.error(err);
            setErrorMsg(err?.message || 'Proses gagal. Coba dengan foto/kualitas lebih ringan.');
            setPhase('error');
        }
    }, [files, quality]);

    const handleDownload = useCallback(() => {
        if (!resultBlob) return;
        const url = URL.createObjectURL(resultBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `splat-${Date.now()}.ply`;
        a.click();
        URL.revokeObjectURL(url);
    }, [resultBlob]);

    const progressPercent = stage?.total ? Math.min(100, (stage.done / stage.total) * 100) : 15;

    return (
        <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    Buat Data 3D
                </Typography>
                <IconButton aria-label="close" onClick={handleClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {!gpuSupported && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Browser ini tidak mendukung WebGPU. Coba buka dengan Chrome atau Edge versi terbaru.
                    </Alert>
                )}

                {phase === 'idle' && (
                    <Box>
                        {/* Drag and Drop Box */}
                        <Paper
                            variant="outlined"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            sx={{
                                p: 4,
                                textAlign: 'center',
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                borderColor: 'divider',
                                cursor: 'pointer',
                                bgcolor: 'action.hover',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.selected',
                                },
                            }}
                        >
                            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body1" fontWeight="medium">
                                Seret foto ke sini, atau klik untuk memilih
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                                20–200 foto yang saling bertampalan dari satu objek/lokasi
                            </Typography>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={(e) => addFiles(e.target.files)}
                            />
                        </Paper>

                        {/* Thumbnail Preview */}
                        {previews.length > 0 && (
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    {previews.length} foto dipilih
                                </Typography>
                                <Grid container spacing={1}>
                                    {previews.map((p, i) => (
                                        // Gunakan prop `size` alih-alih `item` dan `xs/sm/md`
                                        <Grid key={p.url} size={{ xs: 3, sm: 2, md: 1.5 }}>
                                            <Card sx={{ position: 'relative', aspectRatio: '1/1' }}>
                                                <CardMedia component="img" image={p.url} alt={p.name} sx={{ height: '100%', objectFit: 'cover' }} />
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFile(i);
                                                    }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 2,
                                                        right: 2,
                                                        bgcolor: 'rgba(0, 0, 0, 0.6)',
                                                        color: 'white',
                                                        padding: '2px',
                                                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                                                    }}
                                                >
                                                    <CloseIcon sx={{ fontSize: 12 }} />
                                                </IconButton>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>
                        )}

                        {/* Option Kualitas */}
                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel id="quality-select-label">Kualitas</InputLabel>
                                <Select
                                    labelId="quality-select-label"
                                    value={quality}
                                    label="Kualitas"
                                    onChange={(e) => setQuality(e.target.value)}
                                >
                                    {Object.entries(QUALITY_PRESETS).map(([key, v]) => (
                                        <MenuItem key={key} value={key}>
                                            {v.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {errorMsg && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMsg}
                            </Alert>
                        )}
                    </Box>
                )}

                {(phase === 'running' || phase === 'done' || phase === 'error') && (
                    <Box>
                        {/* Viewport Canvas */}
                        <Box
                            sx={{
                                width: '100%',
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: 'common.black',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <canvas ref={canvasRef} width={640} height={400} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </Box>

                        {/* Indicator Progress */}
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {stage ? STAGE_LABELS[stage.stage] || stage.stage : 'Menyiapkan…'}
                                </Typography>
                                {stage?.total && (
                                    <Typography variant="caption" color="text.secondary">
                                        {stage.done}/{stage.total}
                                    </Typography>
                                )}
                            </Box>
                            <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 6, borderRadius: 3 }} />
                        </Box>

                        {/* Training Metrics */}
                        {metrics && (
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={4}>
                                    <Paper variant="outlined" sx={{ py: 1, textAlign: 'center', bgcolor: 'action.hover' }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {metrics.splats?.toLocaleString?.() ?? '–'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            splats
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={4}>
                                    <Paper variant="outlined" sx={{ py: 1, textAlign: 'center', bgcolor: 'action.hover' }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {metrics.iter ?? '–'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            iterasi
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={4}>
                                    <Paper variant="outlined" sx={{ py: 1, textAlign: 'center', bgcolor: 'action.hover' }}>
                                        <Typography variant="body2" fontWeight="bold">
                                            {metrics.psnrTrain ? metrics.psnrTrain.toFixed(1) : '–'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            PSNR (dB)
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        )}

                        {errorMsg && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {errorMsg}
                            </Alert>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Batal
                </Button>

                {phase === 'idle' && (
                    <Button
                        onClick={handleStart}
                        disabled={!gpuSupported || files.length === 0}
                        variant="contained"
                        disableElevation
                    >
                        Start
                    </Button>
                )}

                {phase === 'error' && (
                    <Button onClick={() => setPhase('idle')} variant="contained" startIcon={<RefreshIcon />}>
                        Coba lagi
                    </Button>
                )}

                {phase === 'done' && (
                    <Stack direction="row" spacing={1}>
                        <Button onClick={handleDownload} variant="outlined" startIcon={<DownloadIcon />}>
                            Download .ply
                        </Button>
                        <Button
                            onClick={() => onComplete?.(resultBlob, { splatCount: metrics?.splats })}
                            variant="contained"
                            endIcon={<ArrowForwardIcon />}
                            disableElevation
                        >
                            Lanjut tambah ke katalog
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
}

function waitForTrainingDone(session) {
    return new Promise((resolve) => {
        const checkDone = (e) => {
            if (e?.stage === 'training' && e?.done && e.total && e.done >= e.total) {
                session.off?.('stage', checkDone);
                resolve();
            }
        };
        session.on('stage', checkDone);
    });
}