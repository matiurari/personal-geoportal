import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "../../../../../lib/auth/verifyCredentials";
import { signAccessToken } from "../../../../../lib/auth/jwt";

function isDbConnectionError(err) {
    const code = err?.code || err?.cause?.code;
    const dbErrorCodes = ["ECONNREFUSED", "P1001", "ETIMEDOUT", "ENOTFOUND"];

    if (dbErrorCodes.includes(code)) return true;

    const message = err?.message || "";
    return (
        message.includes("Can't reach database server") ||
        message.includes("P1001")
    );
}

async function loginViaProd(email, password) {
    if (!process.env.AUTH_API_URL) {
        throw new Error("AUTH_API_URL belum diset di .env, tidak bisa fallback ke prod");
    }

    const res = await fetch(`${process.env.AUTH_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || "Email atau password salah!");
    }

    return {
        user_id: data.user.user_id,
        email: data.user.email,
        role: data.user.role,
        accessToken: data.access_token, 
    };
}

export const authOptions = {
    providers: [
        Credentials({
            id: "geoportal-credential",
            name: "geoportal-credential",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = credentials;

                try {
                    const user = await verifyCredentials(email, password);
                    const accessToken = signAccessToken(user);

                    return {
                        user_id: user.user_id,
                        email: user.email,
                        role: user.role,
                        accessToken,
                    };
                } catch (err) {
                    if (isDbConnectionError(err)) {
                        console.warn("[auth] DB local tidak tersedia, fallback ke prod...");
                        try {
                            return await loginViaProd(email, password);
                        } catch (prodErr) {
                            throw new Error(prodErr.message || "Login ke prod gagal");
                        }
                    }

                    throw new Error(err.message || "Terjadi kesalahan server");
                }
            },
        }),
    ],

    session: { strategy: "jwt" },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user_id = user.user_id;
                token.email = user.email;
                token.role = user.role;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.user_id = token.user_id;
            session.user.email = token.email;
            session.user.role = token.role;
            session.accessToken = token.accessToken;
            return session;
        },
    },

    pages: { signIn: "/login" },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };