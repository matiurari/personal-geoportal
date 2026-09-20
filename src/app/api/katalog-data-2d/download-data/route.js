import { NextResponse } from "next/server";
import { requireAuth } from "../../../../../lib/auth/verifyBearerToken";

export async function GET(request) {
  // 1. Validasi Autentikasi
  const { payload, error, status } = requireAuth(request, "viewer");
  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "data_layer.geojson";
  const akses = searchParams.get("akses") || "public";

  if (!url) {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }

  // 2. Validasi Hak Akses Berdasarkan Role dan Status Akses Layer
  const role = payload.role; // contoh: 'viewer', 'admin', 'super_admin'
  const isPrivilegedRole = role === "admin" || role === "super_admin";

  if (akses === "private" && !isPrivilegedRole) {
    return NextResponse.json(
      {
        error:
          "Akses ditolak: Anda tidak memiliki izin untuk mengunduh data privat ini.",
      },
      { status: 403 },
    );
  }

  try {
    const fetchOptions = {
      method: "GET",
      headers: {},
    };

    // 3. Jika akses privat, gunakan GeoServer Admin Basic Auth untuk menembus proteksi layer GeoServer
    if (akses === "private") {
      const gsUser = process.env.GEOSERVER_USERNAME;
      const gsPass = process.env.GEOSERVER_PASSWORD;

      if (gsUser && gsPass) {
        const auth = Buffer.from(`${gsUser}:${gsPass}`).toString("base64");
        fetchOptions.headers["Authorization"] = `Basic ${auth}`;
      }
    }

    // Fetch dilakukan dari server Next.js (membawa credential GeoServer jika private, serta bebas CORS)
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(
        "Gagal mengambil data dari GeoServer (Akses ditolak atau layer tidak ditemukan).",
      );
    }

    const data = await response.text();

    // Kirim response kembali ke client dengan header attachment agar otomatis terdownload
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}.geojson"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
