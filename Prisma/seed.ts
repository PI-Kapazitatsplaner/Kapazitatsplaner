import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Add data here to seed the database
const main = async () => {
    await prisma.user.deleteMany({})
    await prisma.user.createMany({
        data: [
            {
                email: 'd'
            },
            {
                email: 'q'
            }
        ]     
    })
};

if(process.env.seed?.toLowerCase() === 'true') {
    main()
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}else{
    console.log('\nSeeding is disabled. Set the "seed" environment variable to "true" to enable.')
}

export default function seedDB(){
    main()    
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
