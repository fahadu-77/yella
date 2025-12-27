// Use dynamic import because prisma.js might use ES modules
async function main() {
    process.env.DATABASE_URL = "file:dev.db";

    try {
        console.log('Importing prisma from src/lib/prisma.js...');
        // We might need to handle the .js extension or alias
        const { prisma } = require('../src/lib/prisma.js');

        const count = await prisma.user.count();
        console.log('Final Verification Success! User count:', count);
        await prisma.$disconnect();
    } catch (err) {
        console.error('Final Verification Failed:');
        console.error(err);
    }
}

main();
