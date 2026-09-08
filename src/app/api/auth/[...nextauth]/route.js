import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { verifyCredentials } from "../../../../../lib/auth/verifyCredentials";
import { signAccessToken } from "../../../../../lib/auth/jwt";

export const authOptions = {
    providers: [
        Credentials({
            id: "geoportal-credential",
            name: "geoportal-credential",
            credentials: {
                email: { label: "Email", type: "text" }, // email yang user masukan di halaman form login
                password: { label: "Password", type: "password" }, // password yang user masukan di halaman form login
            },
            authorize: async (credentials) => {
                try {
                    const user = await verifyCredentials(credentials.email, credentials.password); // validasi email dan password
                    const accessToken = signAccessToken(user); // buat access token

                    return {
                        user_id: user.user_id,
                        email: user.email,
                        role: user.role,
                        accessToken,
                    };
                } catch (err) {
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