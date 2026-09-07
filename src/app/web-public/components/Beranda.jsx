"use client";

import { Box, Container, Typography, Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

import LaptopChromebookIcon from "@mui/icons-material/LaptopChromebook";
import HubIcon from "@mui/icons-material/Hub";
import ArticleIcon from "@mui/icons-material/Article";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"] });


export default function Beranda() {
  const router = useRouter();

  return (
    <Box className={inter.className}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 560, md: 680 },
          bgcolor: "#0F2A24",
          color: "#F4EFE2",
          overflow: "hidden",
          pt: { xs: 10, md: 0 },
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
            background:
              "linear-gradient(180deg, rgba(15,42,36,0.35) 0%, rgba(15,42,36,0.85) 100%)",
          }}
        />
        
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            className={fraunces.className}
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

      <Box sx={{ bgcolor: "#EFEADC", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: { xs: 3, sm: 3 },
            }}
          >
          </Box>
        </Container>
      </Box>
    </Box>
  );
}