
import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

const protectedPaths = ['/profile', '/match', /*'/chat',*/ '/housing']
const authPaths = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser()
  
  // Protect routes
  if (protectedPaths.some(p => request.nextUrl.pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, request.url))
  }
  
  // Redirect logged-in users away from auth pages
  if (authPaths.some(p => request.nextUrl.pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }
  
  return response
}