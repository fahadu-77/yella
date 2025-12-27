const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    // We keep users to avoid locking ourselves out, but you can clear them if needed
    // await prisma.user.deleteMany();

    const products = [
        {
            name: 'Organic Farm Milk',
            description: 'Fresh, pasteurized whole milk from local organic farms.',
            price: 65,
            stock: 50,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1550583760-464f77d35238?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Artisan Sourdough Bread',
            description: 'Freshly baked sourdough bread with a crispy crust and soft interior.',
            price: 120,
            stock: 20,
            category: 'Bakery',
            image: 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Free Range Eggs (Dozen)',
            description: 'Large brown eggs from healthy, free-range chickens.',
            price: 150,
            stock: 30,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Vine-Ripe Tomatoes',
            description: 'Sweet and juicy tomatoes, perfect for salads and cooking.',
            price: 40,
            stock: 100,
            category: 'Produce',
            image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Basmati Rice (5kg)',
            description: 'Extra-long grain premium basmati rice for aromatic biryanis.',
            price: 750,
            stock: 15,
            category: 'Pantry',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Organic Bananas',
            description: 'Naturally ripened, sweet bananas from local plantations.',
            price: 60,
            stock: 200,
            category: 'Produce',
            image: 'https://images.unsplash.com/photo-1603833665858-e81b1c7e4660?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Salted Butter (500g)',
            description: 'Creamy and rich buttery goodness for your toast.',
            price: 260,
            stock: 40,
            category: 'Dairy',
            image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800',
        },
        {
            name: 'Whole Wheat Atta (10kg)',
            description: 'High-fiber chakki fresh atta for soft rotis.',
            price: 450,
            stock: 25,
            category: 'Pantry',
            image: 'https://images.unsplash.com/photo-1627485264133-fb710daea1aa?auto=format&fit=crop&q=80&w=800',
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
