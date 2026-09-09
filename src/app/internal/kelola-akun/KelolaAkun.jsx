"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Chip, Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const dummyAkun = [
  { id: 1, nama: "Admin", email: "admin@big.go.id", role: "Admin", status: "Aktif" },
  { id: 2, nama: "Operator", email: "operatorspasial@big.go.id", role: "Operator", status: "Nonaktif" },
];

export default function KelolaAkun() {
  const [akun] = useState(dummyAkun);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "#1E1E2D" }}>
          Kelola Akun
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disableElevation
          sx={{ textTransform: "none", fontWeight: 600, borderRadius: 2, bgcolor: "#4F46E5", "&:hover": { bgcolor: "#3730A3" } }}
        >
          Tambah Akun
        </Button>
      </Box>
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
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {akun.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  bgcolor: "#fff",
                  "&:hover": { bgcolor: "#F9FAFB" },
                  "& .MuiTableCell-root": { color: "#1E1E2D" },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "#818CF8", color: "#fff" }}>
                      {row.nama.charAt(0)}
                    </Avatar>
                    <Typography fontSize={14} fontWeight={500} sx={{ color: "#1E1E2D" }}>{row.nama}</Typography>
                  </Box>
                </TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      borderRadius: 1.5,
                      fontWeight: 600,
                      bgcolor: row.status === "Aktif" ? "#DCFCE7" : "#F3F4F6",
                      color: row.status === "Aktif" ? "#166534" : "#4B5563",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" sx={{ color: "#4B5563" }}><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" sx={{ color: "#DC2626" }}><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}