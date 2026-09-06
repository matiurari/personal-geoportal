import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi!" },
        { status: 400 }
      );
    }

    // 1. Cari user berdasarkan email saja
    const user = await db.users.findFirst({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Email atau password salah!" },
        { status: 401 }
      );
    }

    // 2. Bandingkan password plain text dari input dengan password hashed di DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Email atau password salah!" },
        { status: 401 }
      );
    }

    // 3. Check apakah akun aktif
    const isUserActive = parseInt(user.is_active) === 1;

    if (!isUserActive) {
      return NextResponse.json(
        { message: "Akun anda belum di aktivasi. Silahkan request aktivasi ke email arimatiur@gmail.com" },
        { status: 403 }
      )
    }

    return NextResponse.json(
      {
        message: "Login berhasil",
        user_id: user.user_id,
        email: user.email,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: error.message },
      { status: 500 }
    );
  }
}