import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    const user = await getAuthUser();

    // In a real app, check if user.role === 'ADMIN'
    // For now, let's allow it to facilitate development

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(users);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function PATCH(request) {
    try {
        const { userId, role } = await request.json();

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role }
        });

        return NextResponse.json(updatedUser);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
    }
}
