"use client";

import { useCallback, useState } from "react";
import { Paper, IconButton, Tooltip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

export default function Locate({ L, map, userMarkerRef }) {
  const [locating, setLocating] = useState(false);

  const handleLocateMe = useCallback(() => {
    if (!L || !map) return;
    if (!navigator.geolocation) {
      alert("Geolocation tidak didukung oleh browser ini.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 17, { duration: 1 });
        if (userMarkerRef.current) {
          map.removeLayer(userMarkerRef.current);
        }
        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:#2A9D8F;border:3px solid #F4EFE2;
            box-shadow:0 0 0 4px rgba(42,157,143,0.35);
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(map);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        alert("Gagal mendapatkan lokasi: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [L, map, userMarkerRef]);

  return (
    <Tooltip title="Lokasi Terkini" placement="left">
      <Paper
        elevation={3}
        component={IconButton}
        onClick={handleLocateMe}
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          bgcolor: locating ? "#D98E3B" : "#0F2A24",
          color: "#F4EFE2",
          "&:hover": { bgcolor: "#16332B" },
        }}
      >
        <MyLocationIcon fontSize="small" />
      </Paper>
    </Tooltip>
  );
}