"use client";
import { Box, Typography, Grid, Card, CardContent, Chip } from "@mui/material";
import MapIcon from "@mui/icons-material/Map";

const dummyPeta = [
  { id: 1, nama: "Peta RDTR Kecamatan A", tipe: "RDTR" },
  { id: 2, nama: "Peta Zonasi Wilayah B", tipe: "Zonasi" },
];

export default function KatalogPeta() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2} sx={{ color: "#000" }}>
        Katalog Peta
      </Typography>
      <Grid container spacing={2}>
        {dummyPeta.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <Box
                sx={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#e0e0e0",
                }}
              >
                <MapIcon sx={{ fontSize: 60, color: "#9e9e9e" }} />
              </Box>
              <CardContent>
                <Typography variant="subtitle1">{p.nama}</Typography>
                <Chip label={p.tipe} size="small" sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}