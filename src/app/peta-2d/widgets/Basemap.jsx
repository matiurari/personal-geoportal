"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Paper, IconButton, Tooltip, Fade } from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";

const BASEMAPS = {
  satelit: {
    label: "Citra Satelit",
    create: (Cesium) =>
      new Cesium.ArcGisMapServerImageryProvider({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
      }),
  },
  jalan: {
    label: "Peta Jalan (OSM)",
    create: (Cesium) =>
      new Cesium.UrlTemplateImageryProvider({
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c"],
        credit: "© OpenStreetMap contributors",
        maximumLevel: 19, 
      }),
  },
};

export default function Basemap({ viewer, activeBasemap, onChangeBasemap }) {
  const [basemapOpen, setBasemapOpen] = useState(false);

  useEffect(() => {
    if (!viewer || viewer.isDestroyed()) return;
    if (viewer.imageryLayers.length > 0) return; 

    const Cesium = window.Cesium;
    const provider = BASEMAPS[activeBasemap]?.create(Cesium);
    if (provider) {
      viewer.imageryLayers.addImageryProvider(provider);
    }
  }, [viewer]);

  const handleChangeBasemap = useCallback(
    (key) => {
      if (!viewer || viewer.isDestroyed()) return;
      const Cesium = window.Cesium;

      viewer.imageryLayers.removeAll(true);

      const provider = BASEMAPS[key]?.create(Cesium);
      if (provider) {
        viewer.imageryLayers.addImageryProvider(provider);
      }

      onChangeBasemap(key);
      setBasemapOpen(false);
    },
    [viewer, onChangeBasemap]
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Tooltip title="Pilih Basemap" placement="left">
        <Paper
          elevation={3}
          component={IconButton}
          onClick={() => setBasemapOpen((o) => !o)}
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: basemapOpen ? "#D98E3B" : "#0F2A24",
            color: basemapOpen ? "#0F2A24" : "#F4EFE2",
            "&:hover": { bgcolor: basemapOpen ? "#C97F2E" : "#16332B" },
          }}
        >
          <LayersIcon fontSize="small" />
        </Paper>
      </Tooltip>

      <Fade in={basemapOpen}>
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: 0,
            right: 48,
            width: 190,
            borderRadius: 2,
            bgcolor: "#F7F3E7",
            overflow: "hidden",
          }}
        >
          {Object.entries(BASEMAPS).map(([key, bm]) => (
            <Box
              key={key}
              onClick={() => handleChangeBasemap(key)}
              sx={{
                px: 2,
                py: 1.2,
                fontSize: 12.5,
                cursor: "pointer",
                color: key === activeBasemap ? "#D98E3B" : "#16241F",
                fontWeight: key === activeBasemap ? 600 : 400,
                bgcolor: key === activeBasemap ? "rgba(217,142,59,0.1)" : "transparent",
                "&:hover": { bgcolor: "rgba(42,157,143,0.08)" },
              }}
            >
              {bm.label}
            </Box>
          ))}
        </Paper>
      </Fade>
    </Box>
  );
}