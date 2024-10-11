import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(req) {
    const sessionCookie = cookies().get('session');

    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/admin/signin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/dashboard/:path*',
};
