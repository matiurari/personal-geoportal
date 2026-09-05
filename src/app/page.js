"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Container, Stack, Typography } from "@mui/material";

const palette = {
  bg: "#0B1420",
  surface: "#101B29",
  surfaceHover: "#152232",
  line: "#1E2E3F",
  text: "#E7ECE6",
  muted: "#8CA0AA",
  moss: "#5C8B6E",
  mossDim: "#3E5F4B",
  brass: "#C9A227",
  brassDim: "#8A701F",
};

function TopoIcon2D() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M4 40C14 30 20 30 28 36C36 42 42 42 52 32" stroke={palette.moss} strokeWidth="1.5" />
      <path d="M8 30C16 22 22 22 28 27C34 32 40 32 48 24" stroke={palette.moss} strokeWidth="1.5" opacity="0.7" />
      <path d="M12 20C18 14 24 14 28 18C32 22 38 22 44 16" stroke={palette.moss} strokeWidth="1.5" opacity="0.45" />
      <circle cx="28" cy="27" r="2" fill={palette.moss} />
    </svg>
  );
}

function TopoIcon3D() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M6 40L20 24L30 33L38 18L50 34" stroke={palette.brass} strokeWidth="1.5" fill="none" />
      <path d="M6 40L20 24L30 33L38 18L50 34L50 44L6 44Z" fill={palette.brass} opacity="0.12" />
      <path d="M20 24V44" stroke={palette.brass} strokeWidth="1" opacity="0.4" />
      <path d="M38 18V44" stroke={palette.brass} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function MapCard({
  href,
  eyebrow,
  title,
  description,
  coords,
  icon,
  accent,
  accentDim,
  lift,
}) {
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        textDecoration: "none",
        display: "block",
        position: "relative",
        width: { xs: "100%", sm: 300 },
        p: 3.5,
        borderRadius: "4px",
        border: `1px solid ${palette.line}`,
        background: palette.surface,
        transition: "transform 220ms ease, border-color 220ms ease, background 220ms ease",
        "&:hover": {
          background: palette.surfaceHover,
          borderColor: accentDim,
          transform: lift ? "translateY(-6px)" : "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" >
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.02em",
              color: palette.muted,
            }}
          >
            {eyebrow}
          </Typography>
          {icon}
        </Stack>

        <Typography
          sx={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: palette.text,
          }}
        >
          {title}
        </Typography>

        <Typography sx={{ color: palette.muted, fontSize: 14, lineHeight: 1.6, maxWidth: 42 + "ch" }}>
          {description}
        </Typography>

        <Box sx={{ height: "1px", background: palette.line, my: 0.5 }} />

        <Stack direction="row">
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: accent,
            }}
          >
            {coords}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: palette.muted,
            }}
          >
            Buka →
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: palette.bg,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* garis kontur latar, dekoratif & samar */}
      <Box
        component="svg"
        viewBox="0 0 800 800"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.06,
        }}
      >
        {[80, 160, 240, 320, 400, 480, 560, 640].map((r, i) => (
          <circle key={i} cx="400" cy="380" r={r} fill="none" stroke="#FFFFFF" strokeWidth="1" />
        ))}
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", py: 8 }}>
        <Stack spacing={6} >
          <Stack spacing={1.5}>
            <Typography
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: { xs: 34, sm: 44 },
                color: palette.text,
                letterSpacing: "-0.01em",
              }}
            >
              Personal Geoportal
            </Typography>
            <Typography sx={{ color: palette.muted, fontSize: 15, maxWidth: 480 }}>
              Simpan, jelajahi, dan analisis data spasialmu — dari peta datar hingga medan berelevasi.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
          >
            {/* <MapCard
              href="/peta-2d"
              eyebrow="PROYEKSI DATAR"
              title="Peta 2D"
              description="Lihat batas wilayah, jalur, dan titik data dalam tampilan atas yang presisi."
              coords="SKALA 1:25.000"
              icon={<TopoIcon2D />}
              accent={palette.moss}
              accentDim={palette.mossDim}
            />
            <MapCard
              href="/peta-3d"
              eyebrow="MODEL MEDAN"
              title="Peta 3D"
              description="Telusuri elevasi, bangunan, dan bentang alam dalam ruang tiga dimensi."
              coords="ELEVASI +12M"
              icon={<TopoIcon3D />}
              accent={palette.brass}
              accentDim={palette.brassDim}
              lift
            /> */}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}