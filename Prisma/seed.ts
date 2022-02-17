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
    await prisma.sprint.deleteMany({})
    await prisma.pi.deleteMany({})
    await prisma.pi.createMany({
        data: [
            {
                id: 1,
                year: "2022",
                iteration: "PI-01",
                planungVon: new Date(2021,3,1),
                planungBis: new Date(2021,3,2),
            },
            {
                year: "2022",
                iteration: "PI-02"
            },
            {
                year: "2022",
                iteration: "PI-03"
            },
            {
                year: "2022",
                iteration: "PI-04"
            }
        ]
    })
    await prisma.sprint.createMany({
        data: [
            {
                von: new Date(2021,2,10),
                bis: new Date(2021,2,15),
                piId: 1,
                sprintNumber: 1,
            },
            {
                von: new Date(2021,2,16),
                bis: new Date(2021,2,20),
                piId: 1,
                sprintNumber: 2,
            },
            {
                von: new Date(2021,2,21),
                bis: new Date(2021,2,25),
                piId: 1,
                sprintNumber: 3,
            },      
            {
                von: new Date(2021,2,26),
                bis: new Date(2021,2,28),
                piId: 1,
                sprintNumber: 4,
            },
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
