const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

async function main() {
    const url = "file:dev.db";

    try {
        console.log('Testing PrismaLibSQL with options object...');
        const libsql = createClient({ url });
        // Some versions might expect this
        const adapter = new PrismaLibSQL(libsql, { url });
        const prisma = new PrismaClient({ adapter });

        const count = await prisma.user.count();
        console.log('Success with options:', count);
        await prisma.$disconnect();
    } catch (err) {
        console.log('Failed with options object:', err.message);

        try {
            console.log('Testing PrismaLibSQL with property setting...');
            const libsql = createClient({ url });
            const adapter = new PrismaLibSQL(libsql);
            // Maybe it needs a property?
            adapter.url = url;
            const prisma = new PrismaClient({ adapter });
            const count = await prisma.user.count();
            console.log('Success with property:', count);
            await prisma.$disconnect();
        } catch (err2) {
            console.log('Failed with property setting:', err2.message);
        }
    }
}

main();
