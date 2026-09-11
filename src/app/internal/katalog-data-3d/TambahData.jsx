import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import { useEffect, useRef, useState } from "react";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon Leaflet yang sering hilang/broken di Next.js / React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TambahData = ({ form, setForm, handleCloseCreate, accessToken }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    // State internal untuk menyimpan koordinat center point
    const [centerPoint, setCenterPoint] = useState([-6.2088, 106.8456]);

    useEffect(() => {
        if (!mapRef.current) return;

        // 1. Inisialisasi Peta
        const map = L.map(mapRef.current).setView(centerPoint, 13);
        mapInstanceRef.current = map;

        const basemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        });
        map.addLayer(basemap);

        // 2. Pasang Marker Awal jika sudah ada koordinat
        markerRef.current = L.marker(centerPoint).addTo(map);

        // 3. Event Handling: Klik di Peta
        map.on("click", (e) => {
            const { lat, lng } = e.latlng;

            // Pindahkan/Update Marker
            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng]).addTo(map);
            }

            // Update State Internal
            setCenterPoint([lat, lng]);

            // Update Form Parent State jika setForm dikirim sebagai props
            if (setForm) {
                setForm((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                }));
            }
        });

        // Cleanup instance saat komponen unmount
        return () => {
            map.remove();
        };
    }, []);

    const handleSubmitData = async () => {
        const base_url = process.env.BASE_URL;
        console.log(base_url);
        try {
            const formData = new FormData();
            formData.append("file", form.file); // File .glb / .zip
            formData.append("nama", form.nama);
            formData.append("akses", form.akses);
            formData.append("latitude", form.latitude);
            formData.append("longitude", form.longitude);
            formData.append("heading", 0);
            formData.append("pitch", 0);
            formData.append("roll", 0);

            const response = await fetch(`${process.env.BASE_URL}/api/katalog-data-3d/create`, { // Sesuaikan endpoint API Anda
                method: "POST",
                headers: {
                    // Jangan set Content-Type secara manual saat pakai FormData, browser akan otomatis set boundary-nya
                    "Authorization": `Bearer ${accessToken}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal menyimpan data");
            }

            alert("Berhasil menambah data 3D!");
            handleCloseCreate();
            // Refresh data table Anda di sini
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 1, flex: 1 }}>
                <TextField
                    label="Nama Layer"
                    fullWidth
                    value={form?.nama || ""}
                    onChange={(e) => setForm && setForm((f) => ({ ...f, nama: e.target.value }))}
                    sx={{
                        "& .MuiInputBase-input": { color: "#1E1E2D" },
                        "& .MuiInputLabel-root": { color: "#6B7280" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
                    }}
                />

                <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{
                        textTransform: "none",
                        justifyContent: "flex-start",
                        py: 1.2,
                        borderRadius: 2,
                        color: "#1E1E2D",
                        borderColor: "#D1D5DB",
                    }}
                >
                    {form?.file ? form.file.name : "Pilih File 3D Tiles (.zip)"}
                    <input
                        type="file"
                        accept=".glb,.zip" // Mendukung file .glb
                        hidden
                        onChange={(e) => setForm && setForm((f) => ({ ...f, file: e.target.files?.[0] || null }))}
                    />
                </Button>

                <TextField
                    select
                    label="Akses"
                    fullWidth
                    value={form?.akses || "public"}
                    onChange={(e) => setForm && setForm((f) => ({ ...f, akses: e.target.value }))}
                    sx={{
                        "& .MuiInputBase-input": { color: "#1E1E2D" },
                        "& .MuiInputLabel-root": { color: "#6B7280" },
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#D1D5DB" },
                    }}
                >
                    <MenuItem value="public">Public</MenuItem>
                    <MenuItem value="private">Private</MenuItem>
                </TextField>

                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", gap: "5px" }}>
                    <Button variant="contained" color="warning" onClick={handleCloseCreate}>Cancel</Button>
                    <Button variant="contained" color="info" onClick={handleSubmitData}>Submit</Button>
                </Box>
            </Box>

            {/* Container Peta & Display Koordinat */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ width: "300px", height: "250px", borderRadius: 2, overflow: "hidden" }} ref={mapRef}></Box>
                <Typography variant="caption" sx={{ color: "#6B7280" }}>
                    <b>Lat:</b> {centerPoint[0].toFixed(6)}, <b>Lng:</b> {centerPoint[1].toFixed(6)}
                </Typography>
            </Box>
        </Box>
    );
};

export default TambahData;