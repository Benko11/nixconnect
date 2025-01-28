import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { createClient } from "@vercel/postgres";
import bcrypt from "bcrypt";

const client = createClient();
await client.connect();

async function getUser(nickname: string) {
  try {
    const user =
      await client.sql`SELECT * FROM users WHERE nickname = ${nickname}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("Credentials:", credentials);
        const parsedCredentials = z
          .object({
            nickname: z.string().min(2),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { nickname, password } = parsedCredentials.data;
          const user = await getUser(nickname);
          if (!user) return null;

          const passwordMatches = await bcrypt.compare(password, user.password);
          if (passwordMatches) return user;
        }

        console.error("Invalid credentials");
        return null;
      },
    }),
  ],
});
