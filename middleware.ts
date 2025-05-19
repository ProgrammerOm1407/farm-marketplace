import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: {
      persistSession: false,
    },
  })

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/settings"]

  // Check if the route is protected and the user is not authenticated
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !session) {
    // Redirect to login page if trying to access protected route without authentication
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes that should redirect to dashboard if already authenticated
  const authRoutes = ["/login", "/signup"]

  if (authRoutes.includes(request.nextUrl.pathname) && session) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/login", "/signup"],
}
