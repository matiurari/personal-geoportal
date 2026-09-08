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
      <Typography variant="h5" fontWeight={700} mb={2} sx={{ color: "#1E1E2D" }}>
        Katalog Peta
      </Typography>
      <Grid container spacing={2}>
        {dummyPeta.map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #EEF0F4",
                boxShadow: "0 1px 3px rgba(16,24,40,0.06)",
                transition: "box-shadow .2s, transform .2s",
                "&:hover": { boxShadow: "0 8px 20px rgba(16,24,40,0.10)", transform: "translateY(-2px)" },
              }}
            >
              <Box
                sx={{
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg,#EEF2FF 0%,#E0E7FF 100%)",
                }}
              >
                <MapIcon sx={{ fontSize: 56, color: "#4F46E5" }} />
              </Box>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{p.nama}</Typography>
                <Chip
                  label={p.tipe}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1, borderRadius: 1.5, borderColor: "#4F46E5", color: "#4F46E5", fontWeight: 600 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}