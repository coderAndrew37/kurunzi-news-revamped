import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  // 1. REFRESH SESSION
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. DOMAIN & PATH DETECTION
  const url = request.nextUrl;
  const host = request.headers.get("host") || "";
  const isProd = process.env.NODE_ENV === "production";

  const isAdminContext = isProd
    ? host.startsWith("admin.")
    : url.pathname.startsWith("/admin");
  const isWriterContext = isProd
    ? host.startsWith("writer.")
    : url.pathname.startsWith("/dashboard");

  // 3. AUTH & PERMISSION CHECK
  if (isAdminContext || isWriterContext) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("permissions, is_suspended, full_name")
      .eq("id", user.id)
      .single();

    if (profile?.is_suspended) {
      return NextResponse.redirect(new URL("/suspended", request.url));
    }

    // 4. ONBOARDING GATE
    // If they are a writer but haven't set their name, force them to onboarding
    if (
      isWriterContext &&
      !profile?.full_name &&
      !url.pathname.startsWith("/onboarding")
    ) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    const permissions = (profile?.permissions as string[]) || [];

    if (isAdminContext && !permissions.includes("admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (isWriterContext && !permissions.includes("writer")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
