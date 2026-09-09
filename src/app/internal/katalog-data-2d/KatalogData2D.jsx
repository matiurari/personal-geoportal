"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, InputAdornment, Chip, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, FormControlLabel, Switch, Tooltip,
  Alert, Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LayersIcon from "@mui/icons-material/Layers";
import Swal from "sweetalert2";

const DUMMY_DATA_2D = [
  {
    data_2d_id: "d2d-001",
    layer_name: "jakartasatu:batas_kelurahan",
    akses: "public",
    is_editable: false,
    wms_url: "https://geoserver.example.id/jakartasatu/wms",
    wfs_url: "https://geoserver.example.id/jakartasatu/ows?service=WFS&typeName=jakartasatu:batas_kelurahan",
  },
  {
    data_2d_id: "d2d-002",
    layer_name: "jakartasatu:titik_banjir",
    akses: "private",
    is_editable: true,
    wms_url: "https://geoserver.example.id/jakartasatu/wms",
    wfs_url: "https://geoserver.example.id/jakartasatu/ows?service=WFS&typeName=jakartasatu:titik_banjir",
  },
  {
    data_2d_id: "d2d-003",
    layer_name: "jakartasatu:jaringan_jalan",
    akses: "public",
    is_editable: false,
    wms_url: "https://geoserver.example.id/jakartasatu/wms",
    wfs_url: "https://geoserver.example.id/jakartasatu/ows?service=WFS&typeName=jakartasatu:jaringan_jalan",
  },
];

export default function KatalogData2D() {
  const [data, setData] = useState(DUMMY_DATA_2D);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    layer_name: "",
    file: null,
    akses: "private",
    editable: "false",
  });

  const filtered = data.filter((d) =>
    (d.layer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setForm({ layer_name: "", file: null, akses: "private", editable: "false" });
    setErrorMsg("");
    setOpenCreate(true);
  };

  const handleCreate = async () => {
    if (!form.layer_name || !form.file) {
      Swal.fire("Lengkapi form", "Nama layer dan file GeoJSON wajib diisi", "warning");
      return;
    }
    setSubmitting(true);

    await new Promise((r) => setTimeout(r, 600));

    const newRow = {
      data_2d_id: `d2d-${Date.now()}`,
      layer_name: `jakartasatu:${form.layer_name.trim().toLowerCase().replace(/\s+/g, "_")}`,
      akses: form.akses,
      is_editable: form.editable === "true",
      wms_url: "https://geoserver.example.id/jakartasatu/wms",
      wfs_url: `https://geoserver.example.id/jakartasatu/ows?service=WFS&typeName=jakartasatu:${form.layer_name}`,
    };

    setData((prev) => [newRow, ...prev]);
    setSubmitting(false);
    setOpenCreate(false);
    Swal.fire("Berhasil", `Layer "${form.layer_name}" berhasil ditambahkan (dummy)`, "success");
  };

  const handleDelete = async (row) => {
    const confirm = await Swal.fire({
      title: `Hapus "${row.layer_name}"?`,
      text: "Layer akan dihapus dari daftar (mode dummy, belum terhubung ke server).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      confirmButtonColor: "#DC2626",
    });
    if (!confirm.isConfirmed) return;

    setData((prev) => prev.filter((d) => d.data_2d_id !== row.data_2d_id));
    Swal.fire("Terhapus", "Layer berhasil dihapus (dummy)", "success");
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: "#1E1E2D" }}>
            Katalog Data 2D
          </Typography>
          <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
            {data.length} layer terdaftar
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" }, borderRadius: 2, textTransform: "none", fontWeight: 600, px: 2.5 }}
        >
          Tambah Layer
        </Button>
      </Box>

      <TextField
        placeholder="Cari nama layer..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          width: 320,
          bgcolor: "#1E1E2D",
          borderRadius: 2,
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiInputBase-input": { color: "#fff" },
          "& .MuiInputBase-input::placeholder": { color: "#E5E7EB", opacity: 1 },
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "#E5E7EB" }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      <Paper
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #EEF0F4",
          boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  bgcolor: "#1E1E2D",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  border: "none",
                },
              }}
            >
              <TableCell>Layer Name</TableCell>
              <TableCell>Akses</TableCell>
              <TableCell>Editable</TableCell>
              <TableCell>WMS / WFS</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <LayersIcon sx={{ fontSize: 32, color: "#D1D5DB" }} />
                    <Typography variant="body2" sx={{ color: "#1E1E2D" }}>
                      {search ? "Tidak ada layer yang cocok" : "Belum ada data"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {filtered.map((row, idx) => (
              <TableRow
                key={row.data_2d_id}
                sx={{
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#F9FAFB" },
                  "& .MuiTableCell-root": {
                    color: "#1E1E2D",
                    borderBottom: idx === filtered.length - 1 ? "none" : "1px solid #EEF0F4",
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#EEF2FF", color: "#4F46E5" }}>
                      <LayersIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#1E1E2D" }}>
                      {row.layer_name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.akses}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      textTransform: "capitalize",
                      bgcolor: row.akses === "public" ? "#ECFDF5" : "#FEF2F2",
                      color: row.akses === "public" ? "#059669" : "#DC2626",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.is_editable ? "Ya" : "Tidak"}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      color: "#1E1E2D",
                      borderColor: "#D1D5DB",
                    }}
                  />
                </TableCell>
                <TableCell sx={{ maxWidth: 260 }}>
                  <Tooltip title={row.wms_url}>
                    <Typography noWrap variant="body2" sx={{ maxWidth: 240, color: "#1E1E2D" }}>
                      {row.wms_url}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Hapus layer">
                    <IconButton size="small" onClick={() => handleDelete(row)} sx={{ color: "#DC2626" }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog
        open={openCreate}
        onClose={() => !submitting && setOpenCreate(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#fff",
              color: "#1E1E2D",
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#1E1E2D" }}>
          Tambah Layer Data 2D
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1 }}>
            <TextField
              label="Nama Layer"
              fullWidth
              value={form.layer_name}
              onChange={(e) => setForm((f) => ({ ...f, layer_name: e.target.value }))}
              sx={{
                "& .MuiInputBase-input": { color: "#1E1E2D" },
                "& .MuiInputLabel-root": { color: "#6B7280" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
              }}
            />

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                textTransform: "none",
                justifyContent: "flex-start",
                py: 1.2,
                borderRadius: 2,
                color: "#1E1E2D",
                borderColor: "#D1D5DB",
              }}
            >
              {form.file ? form.file.name : "Pilih File GeoJSON"}
              <input
                type="file"
                accept=".geojson,application/geo+json,application/json"
                hidden
                onChange={(e) => setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
              />
            </Button>

            <TextField
              select
              label="Akses"
              fullWidth
              value={form.akses}
              onChange={(e) => setForm((f) => ({ ...f, akses: e.target.value }))}
              sx={{
                "& .MuiInputBase-input": { color: "#1E1E2D" },
                "& .MuiInputLabel-root": { color: "#6B7280" },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
              }}
              slotProps={{
                select: {
                  slotProps: {
                    paper: {
                      sx: { bgcolor: "#fff", color: "#1E1E2D" },
                    },
                  },
                },
              }}
            >
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={form.editable === "true"}
                  onChange={(e) => setForm((f) => ({ ...f, editable: e.target.checked ? "true" : "false" }))}
                  sx={{
                    "& .MuiSwitch-track": {
                      borderRadius: 999,
                      bgcolor: "#D1D5DB",
                      opacity: 1,
                    },
                    "& .MuiSwitch-thumb": {
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    },
                    "& .Mui-checked + .MuiSwitch-track": {
                      bgcolor: "#4F46E5 !important",
                      opacity: 1,
                    },
                    "& .Mui-checked .MuiSwitch-thumb": {
                      color: "#fff",
                    },
                  }}
                />
              }
              label="Editable (WFS-T)"
              sx={{ color: "#1E1E2D", m: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenCreate(false)} disabled={submitting} sx={{ textTransform: "none", color: "#6B7280" }}>
            Batal
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={submitting}
            sx={{ bgcolor: "#4F46E5", "&:hover": { bgcolor: "#4338CA" }, textTransform: "none", fontWeight: 600 }}
          >
            {submitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}