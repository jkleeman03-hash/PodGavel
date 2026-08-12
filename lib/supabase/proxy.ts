import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { dashboardPathForRole } from "@/lib/roles";
import type { Database } from "@/lib/database.types";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/for-podcasters",
  "/for-advertisers",
  "/demo/podcaster",
  "/demo/advertiser",
  "/api/waitlist",
];

// Pre-launch gate: keep the marketing site + waitlist public while holding
// back real accounts. Flip NEXT_PUBLIC_APP_GATE=false (and redeploy) when
// ready to open sign-ups.
const APP_GATED = process.env.NEXT_PUBLIC_APP_GATE !== "false";
const GATED_PATHS = ["/login", "/signup"];
const GATED_PREFIXES = ["/podcaster", "/advertiser"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (
    APP_GATED &&
    (GATED_PATHS.includes(pathname) ||
      GATED_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
  ) {
    return NextResponse.redirect(new URL("/#waitlist", request.url));
  }

  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  if (!user && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const needsRole =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname.startsWith("/podcaster") ||
      pathname.startsWith("/advertiser");

    if (needsRole) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const role = profile?.role;

      if (role) {
        const ownDashboard = dashboardPathForRole(role);

        const onWrongRoleArea =
          (pathname.startsWith("/podcaster") && role !== "podcaster") ||
          (pathname.startsWith("/advertiser") && role !== "advertiser");

        if (pathname === "/login" || pathname === "/signup" || onWrongRoleArea) {
          return NextResponse.redirect(new URL(ownDashboard, request.url));
        }
      }
    }
  }

  return supabaseResponse;
}
