import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    try {
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
        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
