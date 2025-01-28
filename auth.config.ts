import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnFeed = nextUrl.pathname.startsWith("/feed");

      if (isOnFeed) {
        if (isLoggedIn) return true;
        return false;
      }
      if (isLoggedIn) return Response.redirect(new URL("feed", nextUrl));
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
