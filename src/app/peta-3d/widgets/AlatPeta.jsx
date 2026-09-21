"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Paper, IconButton, Tooltip, Fade, CircularProgress } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import TerrainIcon from "@mui/icons-material/Terrain";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import addTerrain from "../utils/addTerrain";
import addInteraksiPengguna from "../utils/addInteraksiPengguna";


export default function AlatPeta({ viewer }) {
  const [open, setOpen] = useState(false);

  // --- Terrain ---
  const terrainControllerRef = useRef(null);
  const [terrainAktif, setTerrainAktif] = useState(false);
  const [terrainLoading, setTerrainLoading] = useState(false);

  // --- Interaksi ---
  const interaksiCleanupRef = useRef(null);
  const [interaksiAktif, setInteraksiAktif] = useState(false);

  useEffect(() => {
    if (!viewer || viewer.isDestroyed()) return;

    terrainControllerRef.current = addTerrain(viewer, {
      aktifTerrainAwal: true,
      onStatusBerubah: (status) => setTerrainAktif(status),
      onLoadingBerubah: (status) => setTerrainLoading(status),
    });

    return () => {
      terrainControllerRef.current = null;
      interaksiCleanupRef.current?.();
      interaksiCleanupRef.current = null;
      setInteraksiAktif(false);
    };
  }, [viewer]);

  const toggleTerrain = () => {
    terrainControllerRef.current?.toggleTerrain();
  };

  const toggleInteraksi = () => {
    if (!viewer) return;

    if (interaksiAktif) {
      interaksiCleanupRef.current?.();
      interaksiCleanupRef.current = null;
      setInteraksiAktif(false);
    } else {
      const { destroy } = addInteraksiPengguna(viewer);
      interaksiCleanupRef.current = destroy;
      setInteraksiAktif(true);
    }
  };

  const ITEMS = [
    {
      key: "terrain",
      label: terrainLoading ? "Memuat Terrain..." : "Terrain (DEM)",
      icon: terrainLoading ? (
        <CircularProgress size={14} sx={{ color: "inherit" }} />
      ) : (
        <TerrainIcon fontSize="small" />
      ),
      aktif: terrainAktif,
      disabled: terrainLoading,
      onClick: toggleTerrain,
    },
    {
      key: "interaksi",
      label: "Interaksi Klik Objek",
      icon: <TouchAppIcon fontSize="small" />,
      aktif: interaksiAktif,
      disabled: false,
      onClick: toggleInteraksi,
    },
  ];

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title="Alat Peta" placement="left">
        <Paper
          elevation={3}
          component={IconButton}
          onClick={() => setOpen((o) => !o)}
          sx={{
            top: 48,
            right: 0,
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: open ? "#D98E3B" : "#0F2A24",
            color: open ? "#0F2A24" : "#F4EFE2",
            "&:hover": { bgcolor: open ? "#C97F2E" : "#16332B" },
          }}
        >
          <TuneIcon fontSize="small" />
        </Paper>
      </Tooltip>

      <Fade in={open}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: 0,
            right: 48,
            width: 210,
            borderRadius: 2,
            bgcolor: "#F7F3E7",
            overflow: "hidden",
          }}
        >
          {ITEMS.map((item) => (
            <Box
              key={item.key}
              onClick={item.disabled ? undefined : item.onClick}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.2,
                fontSize: 12.5,
                cursor: item.disabled ? "default" : "pointer",
                opacity: item.disabled ? 0.6 : 1,
                color: item.aktif ? "#D98E3B" : "#16241F",
                fontWeight: item.aktif ? 600 : 400,
                bgcolor: item.aktif ? "rgba(217,142,59,0.1)" : "transparent",
                "&:hover": item.disabled ? {} : { bgcolor: "rgba(42,157,143,0.08)" },
              }}
            >
              {item.icon}
              {item.label}
            </Box>
          ))}
        </Paper>
      </Fade>
    </Box>
  );
}