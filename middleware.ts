
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "@/lib/auth"

const protectedRoutes = ["/dashboard", "/admin", "/chat", "/sensors", "/analytics", "/profile", "/farms"]
const authRoutes = ["/auth/login", "/auth/register"]
const publicRoutes = ["/", "/about", "/features", "/contact", "/api/health"]

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))
    const isAuthRoute = authRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/api/') || path.startsWith('/_next/')

    // Create response
    let response = NextResponse.next()

    // Add security headers for all requests
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // Skip auth check for public routes
    if (isPublicRoute && !isProtectedRoute) {
      return response
    }

    const session = request.cookies.get("session")?.value

    // Check if user is authenticated
    let isAuthenticated = false
    let userSession = null

    if (session) {
      try {
        userSession = await decrypt(session)
        isAuthenticated = !!userSession
        
        // Check session expiration
        if (userSession && userSession.exp < Math.floor(Date.now() / 1000)) {
          isAuthenticated = false
          userSession = null
        }
      } catch (error) {
        console.warn('Invalid session detected:', error)
        isAuthenticated = false
        userSession = null
      }
    }

    // Clear invalid or expired session - but only if we're not already on auth pages
    if (!isAuthenticated && session && !isAuthRoute && !isPublicRoute) {
      response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.set('session', '', { 
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      return response
    }

    // Redirect to login if accessing protected route without authentication
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set('from', path)
      return NextResponse.redirect(loginUrl)
    }

    // Redirect to dashboard if accessing auth routes while authenticated
    if (isAuthRoute && isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Admin route protection
    if (path.startsWith('/admin') && userSession?.userType !== 'admin') {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // Add user info to headers for API routes
    if (userSession && path.startsWith('/api/')) {
      response.headers.set('x-user-id', userSession.userId)
      response.headers.set('x-user-type', userSession.userType)
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)
    
    // Only redirect to login on error if not already on auth/public routes
    if (!isAuthRoute && !isPublicRoute) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.set('session', '', { 
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      
      // Add security headers even on error
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    } else {
      // If on auth/public routes, just continue with cleared session
      const response = NextResponse.next()
      response.cookies.set('session', '', { 
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      })
      
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      return response
    }
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
