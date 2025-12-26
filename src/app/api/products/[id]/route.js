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
        const { name, description, price, stock, category, image } = await request.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                price: price !== undefined ? parseFloat(price) : undefined,
                stock: stock !== undefined ? parseInt(stock) : undefined,
                category,
                image,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') { // Only ADMIN can delete
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}
