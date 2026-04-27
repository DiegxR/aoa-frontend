import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_ROUTES = ["/", "/signup"];
const DASHBOARD_BY_ROLE: Record<string, string> = {
  admin: "/admin/dashboard",
  user:  "/user/dashboard",
};

const ME_QUERY = `
  query Me {
    me {
      id
      role
    }
  }
`;

const getDashboardByRole = (role: string | undefined) =>
  DASHBOARD_BY_ROLE[(role ?? "").toLowerCase()] ?? DASHBOARD_BY_ROLE.user;

// ── Helpers ──────────────────────────────────────────────────────────────────

const isProtectedRoute = (pathname: string) =>
  pathname.startsWith("/admin") || pathname.startsWith("/user");

const isValidToken = (token: string | undefined): token is string =>
  !!token && token !== "undefined" && token !== "null" && token.length > 10;

// ── Fetch con timeout para no bloquear el middleware ─────────────────────────

async function fetchCurrentUser(token: string) {
  const endpoint =
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql";

  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 3000); // 3s máximo

  try {
    const response = await fetch(endpoint, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body:   JSON.stringify({ query: ME_QUERY }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const payload = await response.json();
    if (payload?.errors || !payload?.data?.me) return null;

    return payload.data.me as { id: string; role: string };

  } catch (error: unknown) {
    // AbortError = timeout, FetchError = backend caído → no bloquear al usuario
    const name = (error as Error)?.name;
    if (name !== "AbortError") {
      console.error("[middleware] fetchCurrentUser failed:", (error as Error).message);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Middleware principal ──────────────────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawToken     = request.cookies.get("token")?.value;

  // 1. Sin token válido → no tocar el backend, decidir solo con la ruta
  if (!isValidToken(rawToken)) {
    if (isProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();   // rutas públicas pasan sin fetch
  }

  // 2. Token presente → consultar quién es
  const me = await fetchCurrentUser(rawToken);

  if (!me) {
    if (isProtectedRoute(pathname)) {
      const res = NextResponse.redirect(new URL("/", request.url));
      res.cookies.delete("token");   // limpiar cookie inválida
      return res;
    }
    return NextResponse.next();     // login/signup siguen accesibles
  }

  // 4. Token válido → redirigir si está en login/signup
  const dashboardPath = getDashboardByRole(me.role);

  if (AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  // 5. Control de acceso por rol
  if (pathname.startsWith("/admin") && me.role.toLowerCase() !== "admin") {
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  if (pathname.startsWith("/user") && me.role.toLowerCase() === "admin") {
    return NextResponse.redirect(new URL(DASHBOARD_BY_ROLE.admin, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signup", "/admin/:path*", "/user/:path*"],
};