const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding products...');

    const products = [
        {
            name: 'Premium Mysore Sandal Soap',
            description: 'Traditional sandalwood soap from Karnataka, known for its unique fragrance and skin-nourishing properties.',
            price: 75.00,
            stock: 100,
            category: 'Beauty',
            image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Organic Coorg Coffee Beans',
            description: 'Rich, aromatic coffee beans sourced directly from the lush plantations of Coorg.',
            price: 450.00,
            stock: 50,
            category: 'Beverages',
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Byadagi Chillies (Dried)',
            description: 'Deep red, mildly pungent chillies famous for their vibrant color and flavor.',
            price: 120.00,
            stock: 200,
            category: 'Spices',
            image: 'https://images.unsplash.com/photo-1599330962369-652a9a7a9354?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Fresh Alphonso Mangoes (Box of 6)',
            description: 'Sweet, juicy, and legendary mangoes from the coastal regions.',
            price: 899.00,
            stock: 30,
            category: 'Fruits',
            image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Handcrafted Channapatna Toys',
            description: 'Eco-friendly wooden toys made by traditional artisans using natural colors.',
            price: 350.00,
            stock: 40,
            category: 'Toys',
            image: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&q=80&w=800',
        }
    ];

    for (const p of products) {
        await prisma.product.upsert({
            where: { id: p.id || 'stub-' + p.name.replace(/\s+/g, '-').toLowerCase() },
            update: p,
            create: {
                ...p,
                id: p.id || 'stub-' + p.name.replace(/\s+/g, '-').toLowerCase()
            },
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
