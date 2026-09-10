"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, InputAdornment, Chip, Button, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, MenuItem, Tooltip, Alert, Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import Swal from "sweetalert2";
import TambahData from "./TambahData";


const DUMMY_DATA_3D = [
  {
    data_3d_id: "d3d-001",
    layer_name: "jakartasatu_3d_gedung_thamrin",
    akses: "public",
    source_url: "https://3dtiles.example.id/thamrin/tileset.json",
  },
  {
    data_3d_id: "d3d-002",
    layer_name: "jakartasatu_3d_gedung_sudirman",
    akses: "private",
    source_url: "https://3dtiles.example.id/sudirman/tileset.json",
  },
];

export default function KatalogData3D() {
  const [data, setData] = useState(DUMMY_DATA_3D);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    layer_name: "",
    file: null,
    akses: "private",
  });


  const filtered = data.filter((d) =>
    (d.layer_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setForm({ layer_name: "", file: null, akses: "private" });
    setErrorMsg("");
    setOpenCreate(true);
  };

  const handleCreate = async () => {
    if (!form.layer_name || !form.file) {
      Swal.fire("Lengkapi form", "Nama layer dan file wajib diisi", "warning");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));

    const newRow = {
      data_3d_id: `d3d-${Date.now()}`,
      layer_name: form.layer_name.trim().toLowerCase().replace(/\s+/g, "_"),
      akses: form.akses,
      source_url: `https://3dtiles.example.id/${form.layer_name}/tileset.json`,
    };

    setData((prev) => [newRow, ...prev]);
    setSubmitting(false);
    setOpenCreate(false);
    Swal.fire("Berhasil", `Layer 3D "${form.layer_name}" berhasil ditambahkan (dummy)`, "success");
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

    setData((prev) => prev.filter((d) => d.data_3d_id !== row.data_3d_id));
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
            Katalog Data 3D
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
          Tambah Layer 3D
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

      <Paper sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid #EEF0F4", boxShadow: "0 1px 2px rgba(16,24,40,0.06)" }}>
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
                },
              }}
            >
              <TableCell>Layer Name</TableCell>
              <TableCell>Akses</TableCell>
              <TableCell>Sumber</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
                    <ViewInArIcon sx={{ fontSize: 32, color: "#D1D5DB" }} />
                    <Typography variant="body2" sx={{ color: "#9CA3AF" }}>
                      {search ? "Tidak ada layer yang cocok" : "Belum ada data"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}

            {filtered.map((row) => (
              <TableRow
                key={row.data_3d_id}
                sx={{
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#F9FAFB" },
                  "& .MuiTableCell-root": { color: "#1E1E2D" },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#EEF2FF", color: "#4F46E5" }}>
                      <ViewInArIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                  <Tooltip title={row.source_url || "-"}>
                    <Typography noWrap variant="body2" sx={{ maxWidth: 240, color: "#6B7280" }}>
                      {row.source_url || "-"}
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
          Tambah Layer Data 3D
        </DialogTitle>
        <DialogContent>
          <TambahData form={form} />
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