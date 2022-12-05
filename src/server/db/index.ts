import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
	prisma?: PrismaClient;
};

const prisma: PrismaClient =
	prismaGlobal.prisma ||
	new PrismaClient({
		log: ['query'],
	});

if (process.env.NODE_ENV !== 'production') {
	prismaGlobal.prisma = prisma;
}

export default prisma;
