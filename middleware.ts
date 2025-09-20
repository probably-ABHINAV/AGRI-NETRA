
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "@/lib/auth"

const protectedRoutes = ["/dashboard", "/admin", "/chat", "/sensors", "/analytics"]
const authRoutes = ["/auth/login", "/auth/register"]

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
    const isAuthRoute = authRoutes.includes(path)

    const session = request.cookies.get("session")?.value

    // Check if user is authenticated
    let isAuthenticated = false
    if (session) {
      try {
        const decrypted = await decrypt(session)
        isAuthenticated = !!decrypted
      } catch (error) {
        // Invalid session - clear the cookie
        console.warn('Invalid session detected:', error)
        isAuthenticated = false
        
        // Clear invalid session cookie
        const response = NextResponse.next()
        response.cookies.set('session', '', { expires: new Date(0) })
        return response
      }
    }

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // On error, allow the request to continue but clear any invalid session
    const response = NextResponse.next()
    response.cookies.set('session', '', { expires: new Date(0) })
    return response
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
