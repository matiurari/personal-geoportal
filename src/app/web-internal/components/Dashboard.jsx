"use client";
import { Grid, Paper, Typography, Box } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import MapIcon from "@mui/icons-material/Map";
import GroupIcon from "@mui/icons-material/Group";

const stats = [
  { label: "Total Data", value: 128, icon: <StorageIcon fontSize="large" color="primary" /> },
  { label: "Total Peta", value: 42, icon: <MapIcon fontSize="large" color="success" /> },
  { label: "Total Akun", value: 15, icon: <GroupIcon fontSize="large" color="warning" /> },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3} sx={{ color: "#000" }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
              {s.icon}
              <Box>
                <Typography variant="h4">{s.value}</Typography>
                <Typography color="text.secondary">{s.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}