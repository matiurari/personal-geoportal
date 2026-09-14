'use client'
import React, { useEffect, useState } from 'react'
import {
    Container, Box, Typography, Avatar, Card, CardContent,
    Button, Stack, Grid, Chip, Divider, CircularProgress, Alert, Paper
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import EmailIcon from '@mui/icons-material/Email'
import BadgeIcon from '@mui/icons-material/Badge'
import MapIcon from '@mui/icons-material/Map'
import View3dIcon from '@mui/icons-material/ViewInAr'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useSession } from 'next-auth/react'

const Profile = () => {
    const { data: session, status } = useSession();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = session?.user?.id || session?.user?.user_id;
            const token = session?.accessToken;

            if (!userId || !token) return;

            try {
                setLoading(true);
                const response = await fetch(`/portal/api/users/detail/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Gagal mengambil data profile');
                }

                setUserData(result.data);
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchUserData();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [session, status]);

    if (loading || status === 'loading') {
        return (
            <Box display="flex" justifycontent="center" alignitems="center" minheight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (errorMsg) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Alert severity="error">{errorMsg}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ py: 4 }}>
                <Card sx={{ borderRadius: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: 'hidden' }}>

                    {/* Header Banner */}
                    <Box
                        sx={{
                            height: 120,
                            background: 'linear-gradient(135deg, #1976d2 0%, #004ba0 100%)',
                            position: 'relative'
                        }}
                    />

                    <CardContent sx={{ pt: 0, px: 3, pb: 3 }}>
                        {/* Avatar & Main Info */}
                        <Box
                            display="flex"
                            flexdirection="column"
                            alignitems="center"
                            sx={{ marginTop: '-50px', mb: 2 }}
                        >
                            <Avatar
                                alt={userData?.nama || 'User'}
                                src="/avatar.jpg"
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '4px solid white',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                    mb: 1
                                }}
                            />
                            <Typography variant="h5" fontWeight="bold" align="center">
                                {userData?.nama || 'Nama Tidak Tersedia'}
                            </Typography>

                            <Stack direction="row" spacing={1} alignitems="center" sx={{ mt: 0.5 }}>
                                <Chip
                                    label={userData?.role || 'User'}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}
                                />
                                {userData?.is_active && (
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Aktif"
                                        color="success"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            </Stack>
                        </Box>

                        {/* Quick Stats Data Katalog */}
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, my: 2, backgroundColor: '#a9acaf' }}>
                            <Grid container spacing={2} textalign="center">
                                <Grid xs={6}>
                                    <Stack direction="row" justifycontent="center" alignitems="center" spacing={1}>
                                        <MapIcon color="action" fontSize="small" />
                                        <Typography variant="h6" fontWeight="bold">
                                            {userData?._count?.katalog_data_2d ?? 0}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">Data 2D</Typography>
                                </Grid>
                                <Divider orientation="vertical" flexItem sx={{ mr: "-1px" }} />
                                <Grid xs={6}>
                                    <Stack direction="row" justifycontent="center" alignitems="center" spacing={1}>
                                        <View3dIcon color="action" fontSize="small" />
                                        <Typography variant="h6" fontWeight="bold">
                                            {userData?._count?.katalog_data_3d ?? 0}
                                        </Typography>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">Data 3D</Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Metadata Info */}
                        <Stack spacing={1.5} sx={{ my: 2.5 }}>
                            <Stack direction="row" alignitems="center" spacing={1.5}>
                                <EmailIcon color="disabled" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    {userData?.email}
                                </Typography>
                            </Stack>
                            <Stack direction="row" alignitems="center" spacing={1.5}>
                                <BadgeIcon color="disabled" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                    ID: {userData?.user_id}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Action Buttons */}
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<EditIcon />}
                            sx={{
                                borderRadius: 2.5,
                                py: 1,
                                textTransform: 'none',
                                fontWeight: 'bold'
                            }}
                        >
                            Edit Profil
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default Profile;