"use client";

import { Box, Container, Typography } from "@mui/material";

export default function Beranda() {
  return (
    <Box
      sx={{
        height: { xs: "calc(100vh - 56px)", md: "calc(100vh - 64px)" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          bgcolor: "#0F2A24",
          color: "#F4EFE2",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            backgroundImage:
              "repeating-radial-gradient(circle at 15% 25%, transparent 0px, transparent 22px, rgba(244,239,226,0.06) 23px, rgba(244,239,226,0.06) 24px), " +
              "repeating-radial-gradient(circle at 85% 75%, transparent 0px, transparent 30px, rgba(244,239,226,0.05) 31px, rgba(244,239,226,0.05) 32px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(15,42,36,0.35) 0%, rgba(15,42,36,0.85) 100%)",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: { xs: 34, md: 56 },
              lineHeight: 1.1,
              maxWidth: 640,
            }}
          >
            Portal informasi geospasial untuk perencanaan wilayah
          </Typography>

          <Box sx={{ width: 64, height: 2, bgcolor: "#D98E3B", my: 3 }} />

          <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 480, fontSize: 16, lineHeight: 1.6 }}>
            Akses data dan peta geospasial resmi untuk mendukung transparansi dan
            pengambilan keputusan berbasis lokasi.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}