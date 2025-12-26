import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'yella-default-secret';

export async function signToken(payload) {
    return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export async function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
}

export async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('yella_auth')?.value;

    if (!token) return null;

    return await verifyToken(token);
}

export async function setAuthCookie(token) {
    const cookieStore = await cookies();
    cookieStore.set('yella_auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });
}

export async function removeAuthCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('yella_auth');
}
