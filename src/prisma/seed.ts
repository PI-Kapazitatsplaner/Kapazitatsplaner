import { Prisma, PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

//Add data here to seed the database
const main = async () => {
    await prisma.user.deleteMany({});
    await prisma.user.createMany({
        data: [
            {
                sub: 'c2842822-67f5-4759-8db8-a431ddfc3500' //hr7
            },
            {
                sub: '4296e3d8-a609-4ffa-b27a-3106ed7a5126', //gif
                preferencesWhiteMode: true
            }
        ]
    });
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
