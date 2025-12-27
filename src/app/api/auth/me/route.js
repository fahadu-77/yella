import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const authUser = await getAuthUser();
        if (!authUser) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isStaffRequested: true,
                staffRequestDate: true,
                createdAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error('Error in /api/auth/me:', err);
        return NextResponse.json({
            error: 'Failed to fetch profile',
            details: err.message
        }, { status: 500 });
    }
}
