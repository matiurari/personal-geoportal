import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth/verifyBearerToken";
import { db } from "../../../../../lib/db";

export async function GET(request) {
    // 1. Validasi Autentikasi (Tambahkan parameter `request`)
    const { payload, error, status } = requireAuth(request, "admin");
    if (error) {
        return NextResponse.json({ message: error }, { status });
    }

    try {
        // 2. Query Data dari Database
        const rawData = await db.katalog_data_2d.findMany({
            select: {
                data_2d_id: true,
                layer_name: true,
                akses: true,
                is_editable: true,
                wms_url: true,
                wfs_url: true,
                user_author: {
                    select: {
                        email: true,
                    },
                },
            }
        });

        // 3. Format hasil agar 'author' berisi string email
        const data = rawData.map((item) => ({
            data_2d_id: item.data_2d_id,
            layer_name: item.layer_name,
            akses: item.akses,
            is_editable: item.is_editable,
            wms_url: item.wms_url,
            wfs_url: item.wfs_url,
            author: item.user_author?.email, // Mengambil email dari relasi
        }));

        // 4. Return Response Sukses
        return NextResponse.json({
            message: "Berhasil mengambil daftar katalog 2D",
            data: data,
        });
    } catch (err) {
        return NextResponse.json(
            { message: err.message || "Terjadi kesalahan pada server" },
            { status: 500 }
        );
    }
}