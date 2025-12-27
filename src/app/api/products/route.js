import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(request) {
    const user = await getAuthUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const data = await request.json();
        if (!data.name || data.price === undefined) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                ...data,
                price: parseFloat(data.price),
                stock: parseInt(data.stock) || 0,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
