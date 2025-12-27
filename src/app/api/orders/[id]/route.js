import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    const user = await getAuthUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        const { status } = await request.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(order);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }
}
