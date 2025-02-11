import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

const accessRules = {
    Admin: [
        '/dashboard',
        '/user',
        '/mahasiswa',
        '/praktikum',
        '/laboratorium',
        '/faceRecognition',
        '/absensi',
        '/laporan',
    ],
    Kalab: [
        '/dashboard',
        '/mahasiswa',
        '/laporan',
        '/praktikum',
        '/laboratorium',
    ],
    Aslab: [
        '/dashboard',
        '/praktikum',
        '/absensi',
        // '/face-recognition',
        '/laporan',
    ],
};

export async function middleware(req) {
    const token = req.cookies.get('user_session')?.value || null;
    const currentUrl = req.nextUrl.pathname;

    console.log('[Middleware] Current URL:', currentUrl);
    console.log('[Middleware] Token:', token);

    // **1. Akses login tanpa token diperbolehkan**
    if (!token && currentUrl === '/login') {
        console.log('[Middleware] No token found, but accessing /login, proceed.');
        return NextResponse.next();
    }

    // **2. Redirect ke login jika tidak ada token (dan bukan ke halaman login)**
    if (!token && currentUrl !== '/login') {
        console.log('[Middleware] No token found, redirecting to /login');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // **3. Validasi dan proses token jika token ada**
    if (token) {
        try {
            // Verifikasi dan decode token
            const { payload } = await jwtVerify(token, secret);
            console.log('[Middleware] Token verified successfully:', payload);

            const role = payload.role; // Ambil role dari payload
            console.log('[Middleware] User role:', role);

            const allowedPaths = accessRules[role] || [];
            if (!allowedPaths.includes(currentUrl)) {
                console.log(
                    `[Middleware] Role ${role} tidak memiliki akses ke ${currentUrl}, redirect ke /dashboard`
                );
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('[Middleware] Token verification failed:', error.message);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }
}

// Tentukan rute yang menggunakan middleware
export const config = {
    matcher: [
        '/login',
        '/dashboard',
        '/user',
        '/mahasiswa',
        '/praktikum',
        '/laboratorium',
        '/faceRecognition',
        '/absensi',
        '/laporan',
    ],
};