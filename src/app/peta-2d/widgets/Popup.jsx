"use client";

import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

export default function PopUp({ L, map, addedLayersRef, clickLatLng, setClickLatLng }) {
  const [popUpContents, setPopUpContents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!clickLatLng || !map || !L) return;

    let cancelled = false;

    const fetchAttributes = async () => {
      setIsLoading(true);
      try {
        const results = await queryWmsLayers(clickLatLng, map, L, addedLayersRef);
        if (cancelled) return;

        const valid = results.filter(
          (r) => r.attributes && Object.keys(r.attributes).length > 0
        );

        if (valid.length === 0) {
          setClickLatLng(null);
          return;
        }

        setPopUpContents(valid);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error saat mengambil atribut layer WMS:", err);
        if (!cancelled) setClickLatLng(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAttributes();

    return () => {
      cancelled = true;
    };
  }, [clickLatLng]);

   
  const queryWmsLayers = async (latlng, map, L, addedLayersRef) => {
    const wmsLayers = Object.entries(addedLayersRef.current || {})
      .map(([id, layer]) => ({ id, layer }))
      .filter(({ layer }) => layer && map.hasLayer(layer) && layer.wmsParams);

    if (wmsLayers.length === 0) return [];

    const size = map.getSize();
    const point = map.latLngToContainerPoint(latlng, map.getZoom());
    const bounds = map.getBounds();
    const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;

    const requests = wmsLayers.map(async ({ id, layer }) => {
      try {
        const baseUrl = layer._url; 
        const layerName = layer.wmsParams?.layers; 
        const version = layer.wmsParams?.version || "1.1.0";

        if (!baseUrl || !layerName) return [];

        const params = new URLSearchParams({
          SERVICE: "WMS",
          VERSION: version,
          REQUEST: "GetFeatureInfo",
          LAYERS: layerName,
          QUERY_LAYERS: layerName,
          STYLES: "",
          BBOX: bbox,
          FEATURE_COUNT: "10",
          HEIGHT: String(size.y),
          WIDTH: String(size.x),
          FORMAT: "image/png",
          INFO_FORMAT: "application/json",
          SRS: version === "1.3.0" ? "EPSG:4326" : "EPSG:4326",
          CRS: "EPSG:4326",
          X: String(Math.round(point.x)),
          Y: String(Math.round(point.y)),
        });

        const res = await fetch(`${baseUrl}?${params.toString()}`);
        if (!res.ok) return [];

        const data = await res.json();

        return (data.features || []).map((f) => ({
          attributes: f.properties || {},
          layerTitle: formatLayerTitle(layerName),
        }));
      } catch (err) {
        console.error(`Error GetFeatureInfo untuk layer id=${id}:`, err);
        return [];
      }
    });

    const resultsPerLayer = await Promise.all(requests);
    return resultsPerLayer.flat();
  };

  const formatLayerTitle = (name) => {
    if (!name) return "Layer";
    const withoutWorkspace = name.includes(":") ? name.split(":")[1] : name;
    return withoutWorkspace
      .replace(/_[a-f0-9]{8}$/i, "")
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  };

  const handleClose = () => {
    setPopUpContents([]);
    setClickLatLng(null);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          p: 2,
          boxShadow: "2px 4px 12px 0px rgba(0,0,0,0.15)",
        }}
      >
        <CircularProgress size={20} />
      </Box>
    );
  }

  if (popUpContents.length === 0) return null;

  const totalPages = popUpContents.length;
  const current = popUpContents[currentPage - 1];

  return (
    <Box sx={{ boxShadow: "2px 4px 12px 0px rgba(0, 0, 0, 0.15)" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "var(--jakartasatu-biru)",
          borderRadius: "10px 10px 0 0",
          padding: "12px 20px",
        }}
      >
        <Typography
          sx={{
            color: "white",
            fontSize: 16,
            fontWeight: 700,
            maxWidth: 400,
            wordBreak: "break-word",
          }}
        >
          {current.layerTitle}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ padding: "4px", marginTop: "-4px", marginRight: "-12px" }}
        >
          <Close sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <Box
        sx={{
          padding: "5px 20px",
          width: "460px",
          maxHeight: "255px",
          backgroundColor: "white",
          borderRadius: "0 0 10px 10px",
          overflowY: "auto",
        }}
      >
        {Object.entries(current.attributes).map(([key, value]) => (
          <Typography
            key={key}
            sx={{
              color: "var(--jakartasatu-biru)",
              fontSize: 14,
              fontWeight: 600,
              margin: "20px 0",
              wordBreak: "break-word",
            }}
          >
            {key} :{" "}
            <span style={{ fontWeight: 500, color: "rgba(0,0,0,0.7)" }}>
              {value !== null && value !== undefined ? String(value) : "N/A"}
            </span>
          </Typography>
        ))}

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1, pb: 1 }}>
            <IconButton disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              ‹
            </IconButton>
            <Typography sx={{ alignSelf: "center", fontSize: 14 }}>
              {currentPage} dari {totalPages}
            </Typography>
            <IconButton disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              ›
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}