import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

const globalForPrisma = global;

const getPrismaClient = () => {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;

    if (!url && process.env.NODE_ENV === 'production') {
        throw new Error("TURSO_DATABASE_URL is not defined");
    }

    const libsql = createClient({
        url: url || "file:dev.db",
        authToken: authToken,
    });

    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
