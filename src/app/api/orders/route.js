import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET(request) {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const query = user.role === 'CUSTOMER' ? { where: { userId: user.id } } : {};
        const orders = await prisma.order.findMany({
            ...query,
            include: {
                items: { include: { product: true } },
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(orders);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}

export async function POST(request) {
    const user = await getAuthUser();
    try {
        const { items, total, type, userId: manualUserId } = await request.json();
        if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });

        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: user?.id || manualUserId || null,
                    total,
                    type,
                    status: 'PENDING',
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            });

            for (const item of items) {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product?.name || 'product'}`);
                }
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            return newOrder;
        });

        return NextResponse.json(order);
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Failed to create order' }, { status: 500 });
    }
}
