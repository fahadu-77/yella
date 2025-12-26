import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken, setAuthCookie } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { email, password, name } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'CUSTOMER', // Always default to CUSTOMER
            },
        });

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        await setAuthCookie(token);

        return NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        });
    } catch (err) {
        console.error('Registration error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
