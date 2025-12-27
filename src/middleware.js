import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'yella-default-secret');

export async function middleware(request) {
    const token = request.cookies.get('yella_auth')?.value;
    const { pathname } = request.nextUrl;

    // Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            // Use jose for edge-compatible JWT verification
            const { payload } = await jwtVerify(token, SECRET);

            if (payload.role !== 'STAFF' && payload.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (err) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Let users go to login/register even if they have a token
    // This allows them to re-authenticate if their session is "bad"
    // if ((pathname === '/login' || pathname === '/register') && token) {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/login', '/register'],
};
