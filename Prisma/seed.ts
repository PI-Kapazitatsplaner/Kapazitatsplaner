import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Add data here to seed the database
const main = async () => {
};

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });