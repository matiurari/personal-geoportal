import { NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
    const data = await request.json();
    const hashedPassword = await bcrypt.hash(data.password, 10); // Hash password sebelum disimpan ke database
    const user_id = crypto.randomUUID(); // Generate user_id secara otomatis

    try {
        const registerUser = await db.users.create({
            data: {
                user_id: user_id,
                email: data.email,
                password: hashedPassword,
                role: "editor", // Buat default sebagai editor, nanti bisa diubah oleh super admin
                is_active: false, // Default user baru tidak aktif, nanti bisa diaktifkan oleh super admin
            }
        });
        return NextResponse.json({ message: "Berhasil mendaftar" }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}