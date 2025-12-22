import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Wikimedia from "next-auth/providers/wikimedia";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Wikimedia],
});
