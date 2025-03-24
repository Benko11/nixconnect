import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";

const PROTECTED_ROUTES = ["/settings", "/profile", "/search", "/first-time"];
const UNAUTHENTICATED_ROUTES = ["/login", "/register", "/reset-password"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const isAuthenticated = !!data.user;

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const isUnauthenticatedRoute = UNAUTHENTICATED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isUnauthenticatedRoute) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const isAuthenticated = !!data.user;

    if (isAuthenticated) {
      const feedUrl = new URL("/feed", request.url);
      return NextResponse.redirect(feedUrl);
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
