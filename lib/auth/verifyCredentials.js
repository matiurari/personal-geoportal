import bcrypt from "bcryptjs";
import { db } from "../db";

export async function verifyCredentials(email, password) {
    const user = await db.users.findFirst({ where: { email } });

    if (!user) {
        throw new Error("Email atau password salah!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Email atau password salah!");
    }

    const isUserActive = parseInt(user.is_active) === 1;
    if (!isUserActive) {
        throw new Error(
            "Akun anda belum di aktivasi. Silahkan request aktivasi ke email arimatiur@gmail.com"
        );
    }

    return {
        id: user.user_id,
        email: user.email,
        role: user.role, // pastikan table users sudah memiliki kolom role
    };
}