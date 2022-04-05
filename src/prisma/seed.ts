import prisma from "./client";
import piData from './data/pi'
import sprintData from './data/sprints'

//Add data here to seed the database
const main = async () => {
    await prisma.abwesenheit.deleteMany({});
    await prisma.user_Team.deleteMany({})
    await prisma.user.deleteMany({})
    await prisma.team.deleteMany({})
    await prisma.sprint.deleteMany({});
    await prisma.pi.deleteMany({});
    await prisma.user.createMany({
        data: [
            {
                sub: 'c2842822-67f5-4759-8db8-a431ddfc3500', //hr7 -- Default Test User
                firstname: "Rouven",
                lastname: "Hänggi",
                preferencesWhiteMode: false,
                standardAbwesenheiten: [0, 2, 6],
            },
            {
                sub: '4296e3d8-a609-4ffa-b27a-3106ed7a5126', //gif
                firstname: "Gian",
                lastname: "Federspiel",
                preferencesWhiteMode: true,
                standardAbwesenheiten: [0, 3],
            }
        ]
    });
    const Kraftwerk = await prisma.team.create({
        data: {
          teamName: "Kraftwerk"
        }  
      });
      const Rigi = await prisma.team.create({
          data: {
            teamName: "Rigi"
          }  
        });
    //Gian Team Kraftwerk
    await prisma.user_Team.create({
      data: {
        userSub: '4296e3d8-a609-4ffa-b27a-3106ed7a5126',
        teamId: Kraftwerk.id
      }
    });
    //Rouven Team Kraftwerk
    await prisma.user_Team.create({
      data: {
        userSub: 'c2842822-67f5-4759-8db8-a431ddfc3500',
        teamId: Kraftwerk.id
      }
    });//Rouven Team Rigi
    await prisma.user_Team.create({
        data: {
          userSub: 'c2842822-67f5-4759-8db8-a431ddfc3500',
          teamId: Rigi.id
        }
    });

    await prisma.abwesenheit.createMany({
        data: [
            {
                userSub: 'c2842822-67f5-4759-8db8-a431ddfc3500',
                date: new Date(2022, 1, 3)
            },
            {
                userSub: 'c2842822-67f5-4759-8db8-a431ddfc3500',
                date: new Date(2022, 2, 5)
            },
        ]
    });
    await prisma.pi.createMany({ data: piData });
    await prisma.sprint.createMany({ data: sprintData });

};

if (process.env.seed?.toLowerCase() === 'true') {
    main()
        .catch((error) => {
            console.error(error);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
} else {
    console.log('\nSeeding is disabled. Set the "seed" environment variable to "true" to enable.')
}
