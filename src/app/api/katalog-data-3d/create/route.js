import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { requireAuth } from "../../../../../lib/auth/verifyBearerToken"; // Sesuaikan path requireAuth Anda
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(request) {
    // 1. Validasi Autentikasi
    const { payload, error, status } = requireAuth(request, "admin");
    if (error) {
        return NextResponse.json({ message: error }, { status });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const nama = formData.get("nama");
        const akses = formData.get("akses");
        const latitude = formData.get("latitude");
        const longitude = formData.get("longitude");
        const heading = formData.get("heading") || 0;
        const pitch = formData.get("pitch") || 0;
        const roll = formData.get("roll") || 0;

        if (!file) {
            return NextResponse.json({ message: "File .glb tidak boleh kosong" }, { status: 400 });
        }

        // 2. Proses Upload File ke folder root /data (atau /data/models)
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Tentukan direktori tujuan: root_project/data
        const uploadDir = path.join(process.cwd(), "data");

        // Buat folder 'data' jika belum ada
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Buat nama file yang unik untuk menghindari duplikasi/nama bentrok
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const originalName = file.name.replace(/\s+/g, "_"); // Hilangkan spasi
        const filename = `${uniqueSuffix}-${originalName}`;
        const filePath = path.join(uploadDir, filename);

        // Tulis file ke storage lokal
        await writeFile(filePath, buffer);

        // URL atau path relatif file yang akan disimpan ke database
        // (Sesuaikan dengan bagaimana cara Anda nanti melayani/mengakses file ini)
        const fileUrl = `/data/${filename}`;
        const data_3d_id = crypto.randomUUID();

        // 3. Simpan ke Database Prisma
        await db.katalog_data_3d.create({
            data: {
                data_3d_id: data_3d_id,
                nama: nama,
                akses: akses,
                url: fileUrl, // Menyimpan path file
                latitude: parseFloat(latitude),   // Pastikan tipe data float/decimal
                longitude: parseFloat(longitude), // Pastikan tipe data float/decimal
                heading: parseFloat(heading),
                pitch: parseFloat(pitch),
                roll: parseFloat(roll),
                created_by: payload.user_id, // Sesuaikan relasi user jika ada di schema anda
            }
        });

        return NextResponse.json({ message: "Data dan file 3D berhasil disimpan!" }, { status: 200 });
    } catch (err) {
        console.error("Error Upload:", err);
        return NextResponse.json({ message: err.message || "Terjadi kesalahan pada server" }, { status: 500 });
    }
}