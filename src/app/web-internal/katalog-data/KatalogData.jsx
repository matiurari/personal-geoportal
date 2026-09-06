"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, InputAdornment,
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
      <Typography variant="h5" fontWeight={600} mb={2}  sx={{ color: "#000" }}>
        Katalog Data
      </Typography>
      <TextField
        placeholder="Cari data..."
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: 300 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Data</TableCell>
              <TableCell>Kategori</TableCell>
              <TableCell>Terakhir Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.kategori}</TableCell>
                <TableCell>{row.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}