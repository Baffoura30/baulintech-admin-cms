import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@baulin.co.uk" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const adminEmail = process.env.ADMIN_EMAIL?.trim();
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

        console.log(`[Auth Debug] Attempt Email: "${credentials.email}"`);
        console.log(`[Auth Debug] Expected Email: "${adminEmail}"`);
        
        if (!adminEmail || !adminPasswordHash) {
          console.error("[Auth Debug] Missing environment variables");
          throw new Error("Server configuration error");
        }

        if (credentials.email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
          console.warn(`[Auth Debug] Email mismatch: "${credentials.email.trim().toLowerCase()}" vs "${adminEmail.toLowerCase()}"`);
          throw new Error("Invalid credentials");
        }

        try {
          const isPasswordValid = await bcrypt.compare(credentials.password, adminPasswordHash);
          
          if (!isPasswordValid) {
            console.warn("[Auth Debug] Password comparison failed");
            throw new Error("Invalid credentials");
          }

          return {
            id: "admin-1",
            email: adminEmail,
            name: "Baulin Admin",
            role: "owner"
          };
        } catch (error) {
          console.error("[Auth Debug] Bcrypt error:", error);
          throw new Error("Internal authentication error");
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
