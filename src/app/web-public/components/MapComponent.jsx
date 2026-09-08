"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

import Home from "../peta/widgets/Home";
import Locate from "../peta/widgets/Locate";
import Basemap from "../peta/widgets/Basemap";
import Search from "../peta/widgets/Search";


const HOME_COORDS = { lat: -6.1754, lng: 106.8272, zoom: 16 };

const BASEMAPS = {
  satelit: {
    label: "Citra Satelit",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
  jalan: {
    label: "Peta Jalan (OSM)",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
};

const DEFAULT_BASEMAP = "jalan";

export default function MapComponent() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [activeBasemap, setActiveBasemap] = useState(DEFAULT_BASEMAP);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || mapRef.current) return;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [HOME_COORDS.lat, HOME_COORDS.lng],
        zoom: HOME_COORDS.zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

      const basemap = BASEMAPS[DEFAULT_BASEMAP];
      tileLayerRef.current = L.tileLayer(basemap.url, {
        attribution: basemap.attribution,
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const L = ready ? leafletRef.current : null;
  const map = ready ? mapRef.current : null;

  return (
    <Box sx={{ position: "relative", width: "100%", height: "calc(100vh - 64px)" }}>
      {/* MAP CONTAINER */}
      <Box ref={mapContainerRef} sx={{ width: "100%", height: "100%" }} />

      {/* SEARCH  */}
      <Search L={L} map={map} markerRef={markerRef} />

      {/* HOME, LOKASI TERKINI, BASEMAP */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Home map={map} markerRef={markerRef} />
        <Locate L={L} map={map} userMarkerRef={userMarkerRef} />
        <Basemap
          L={L}
          map={map}
          tileLayerRef={tileLayerRef}
          activeBasemap={activeBasemap}
          onChangeBasemap={setActiveBasemap}
        />
      </Box>
    </Box>
  );
}