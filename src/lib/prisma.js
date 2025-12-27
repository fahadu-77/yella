import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = global;

const getPrismaClient = () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    // For local development with a file-based database, use the native Prisma driver
    // as it is much more stable than the LibSQL adapter for local files.
    if (!url || url.startsWith('file:')) {
        return new PrismaClient();
    }

    try {
        const libsql = createClient({
            url: url,
            authToken: authToken,
        });

        const adapter = new PrismaLibSQL(libsql);
        return new PrismaClient({ adapter });
    } catch (err) {
        console.error('Failed to initialize LibSQL adapter, falling back to native:', err);
        return new PrismaClient();
    }
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
