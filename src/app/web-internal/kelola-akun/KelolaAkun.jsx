"use client";
import { useState } from "react";
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Button, IconButton, Chip,
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
        <Typography variant="h5" fontWeight={600}  sx={{ color: "#000" }}>
          Kelola Akun
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Tambah Akun
        </Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {akun.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell>{row.nama}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={row.status === "Aktif" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small"><EditIcon fontSize="small" /></IconButton>
                  <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}