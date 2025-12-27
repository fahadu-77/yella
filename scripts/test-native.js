const { PrismaClient } = require('@prisma/client');

async function main() {
    process.env.DATABASE_URL = "file:dev.db";
    console.log('Testing native Prisma Client...');
    const prisma = new PrismaClient();

    try {
        const count = await prisma.user.count();
        console.log('Native success! User count:', count);
        await prisma.$disconnect();
    } catch (err) {
        console.error('Native Failed:');
        console.error(err.message);
    }
}

main();
