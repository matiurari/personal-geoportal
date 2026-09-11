"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { Cartesian3, Viewer, HeightReference } from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

if (typeof window !== "undefined") {
    window.CESIUM_BASE_URL = process.env.NEXT_PUBLIC_CESIUM_BASE_URL || "/static/cesium";
}

export default function PreviewCesiumModal({ openPreview, item }) {
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!openPreview || !viewerRef.current || !item) return;

        const lat = Number(item.latitude);
        const lon = Number(item.longitude);

        console.log("DEBUG glb url:", item.url, "lat/lon:", lat, lon);

        if (!item.url) {
            console.error("item.url kosong, model tidak akan diminta.");
            return;
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            console.error("Koordinat tidak valid:", item);
            return;
        }

        const viewer = new Viewer(viewerRef.current);
        const position = Cartesian3.fromDegrees(lon, lat, 0);

        const modelEntity = viewer.entities.add({
            position,
            model: {
                uri: item.url,
                scale: 100.0,
                heightReference: HeightReference.CLAMP_TO_GROUND,
            },
        });

        viewer.zoomTo(modelEntity)
            .then(() => console.log("Model berhasil di-load dan di-zoom"))
            .catch((err) => console.error("Gagal load/zoom model:", err));

        return () => viewer.destroy();
    }, [openPreview, item]);

    return (
        <Box
            ref={viewerRef}
            sx={{ width: "100%", height: "500px", bgcolor: "#f8f2f2" }}
        />
    );
}