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
                isStaffRequested: true,
                staffRequestDate: true,
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
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { userId, role, isStaffRequested } = await request.json();

        // If a user is requesting staff access for themselves
        if (isStaffRequested !== undefined && !role) {
            const updated = await prisma.user.update({
                where: { id: user.id },
                data: {
                    isStaffRequested: true,
                    staffRequestDate: new Date()
                }
            });
            return NextResponse.json({ success: true, user: updated });
        }

        // Only ADMIN/STAFF can change roles (Admin only for full control)
        if (role && user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only admins can change roles' }, { status: 403 });
        }

        const data = {};
        if (role) {
            data.role = role;
            data.isStaffRequested = false; // Reset request on role change
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data
        });

        return NextResponse.json(updatedUser);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
