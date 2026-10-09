import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { takeRateLimit, clearRateLimit } from "@/lib/security";
import { loginSchema } from "@/lib/validation";
import authConfig from "@/auth.config";

// Precomputed comparison hash avoids expensive password hashing on every server start.
const dummyPasswordHash = "$2b$12$tw.fnER/Rpkh4/zjadMhpuWYUaEqqvW2qTjRQbl/82Et7S11e/./a";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        const key = `login:${email}`;
        if (!takeRateLimit("login:global", 120, 60_000) || !takeRateLimit(key, 10, 15 * 60_000)) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        const isValid = await bcrypt.compare(password, user?.password ?? dummyPasswordHash);
        if (!user || !isValid) return null;
        clearRateLimit(key);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
