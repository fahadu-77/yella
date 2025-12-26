import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    const user = await getAuthUser();
    if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const { name, description, price, stock, category, image } = await request.json();

        if (!name || price === undefined) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                category,
                image,
            },
        });

        return NextResponse.json(product);
    } catch (err) {
        console.error('Create product error:', err);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}
