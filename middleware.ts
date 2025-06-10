import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define paths that are considered public (accessible without authentication)
  const isPublicPath = path === '/admin/login'

  // Check if the path starts with /admin
  const isAdminPath = path.startsWith('/admin')

  // Get the authentication status from cookies
  // In a real app, you would verify a JWT token or session cookie
  // For this example, we'll check for a simple cookie that would be set on login
  const adminAuth = request.cookies.get('adminAuth')?.value

  // If the path is an admin path but not the login page, and there's no auth cookie,
  // redirect to the login page
  if (isAdminPath && !isPublicPath && !adminAuth) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // If the path is the login page and the user is already authenticated,
  // redirect to the admin dashboard
  if (isPublicPath && adminAuth) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
  ],
}