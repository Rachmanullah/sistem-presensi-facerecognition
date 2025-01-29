'use server'
import { cookies } from 'next/headers'

export async function createSession(userData) {
    const cookieStore = cookies();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 jam
    const token = userData.token;

    await cookieStore.set('user_session', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });

    console.log('[Session Service] Session created and cookie set'); // Debug log
}