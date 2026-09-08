"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, InputAdornment, Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const dummyData = [
  { id: 1, nama: "Data Kependudukan", kategori: "Sosial", updated: "2026-08-01" },
  { id: 2, nama: "Data Fasilitas Kesehatan", kategori: "Kesehatan", updated: "2026-07-20" },
];

export default function KatalogData() {
  const [search, setSearch] = useState("");
  const filtered = dummyData.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "#1E1E2D" }}>
        Katalog Data
      </Typography>
      <TextField
        placeholder="Cari data..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2,
          width: 320,
          bgcolor: "#1E1E2D",
          borderRadius: 2,
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
              <TableCell>Nama Data</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Terakhir Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#F9FAFB" },
                  "& .MuiTableCell-root": { color: "#1E1E2D" },
                }}
              >
                <TableCell sx={{ fontWeight: 500 }}>{row.nama}</TableCell>
                <TableCell>
                  <Chip label={row.kategori} size="small" sx={{ borderRadius: 1.5, bgcolor: "#EEF2FF", color: "#4F46E5", fontWeight: 600 }} />
                </TableCell>
                <TableCell>{row.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}