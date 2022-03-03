import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Add data here to seed the database
const main = async () => {
  await prisma.user.deleteMany({});
  await prisma.user.createMany({
    data: [
      {
        email: "d",
      },
      {
        email: "q",
      },
    ],
  });
  await prisma.sprint.deleteMany({});
  await prisma.pi.deleteMany({});
  await prisma.pi.createMany({
    data: [
      //2022
      {
        id: 1,
        year: "2022",
        iteration: "PI-01",
        planungVon: new Date(2022, 3, 1),
        planungBis: new Date(2022, 3, 2),
      },
      {
        id: 2,
        year: "2022",
        iteration: "PI-02",
        planungVon: new Date(2022, 4, 1),
        planungBis: new Date(2022, 4, 3),
      },
      {
        id: 3,
        year: "2022",
        iteration: "PI-03",
        planungVon: new Date(2022, 5, 1),
        planungBis: new Date(2022, 5, 3),
      },
      {
        id: 4,
        year: "2022",
        iteration: "PI-04",
        planungVon: new Date(2022, 6, 1),
        planungBis: new Date(2022, 6, 3),
      },
      //2023
      {
        id: 5,
        year: "2023",
        iteration: "PI-01",
        planungVon: new Date(2023, 3, 1),
        planungBis: new Date(2023, 3, 2),
      },
      {
        id: 6,
        year: "2023",
        iteration: "PI-02",
        planungVon: new Date(2023, 4, 1),
        planungBis: new Date(2023, 4, 3),
      },
      {
        id: 7,
        year: "2023",
        iteration: "PI-03",
        planungVon: new Date(2023, 5, 1),
        planungBis: new Date(2023, 5, 3),
      },
      {
        id: 8,
        year: "2023",
        iteration: "PI-04",
        planungVon: new Date(2023, 6, 1),
        planungBis: new Date(2023, 6, 3),
      },
    ],
  });
  await prisma.sprint.createMany({
    data: [
      //2022
      //PI-01
      {
        von: new Date(2022, 2, 10),
        bis: new Date(2022, 2, 15),
        piId: 1,
        sprintNumber: 1,
      },
      {
        von: new Date(2022, 2, 16),
        bis: new Date(2022, 2, 20),
        piId: 1,
        sprintNumber: 2,
      },
      {
        von: new Date(2022, 2, 21),
        bis: new Date(2022, 2, 25),
        piId: 1,
        sprintNumber: 3,
      },
      {
        von: new Date(2022, 2, 26),
        bis: new Date(2022, 2, 28),
        piId: 1,
        sprintNumber: 4,
      },
      {
        von: new Date(2022, 3, 26),
        bis: new Date(2022, 3, 28),
        piId: 1,
        sprintNumber: 5,
      },
      {
        von: new Date(2022, 3, 15),
        bis: new Date(2022, 3, 16),
        piId: 1,
        sprintNumber: 6,
      },
      //Pi-02
      {
        von: new Date(2022, 2, 10),
        bis: new Date(2022, 2, 15),
        piId: 2,
        sprintNumber: 1,
      },
      {
        von: new Date(2022, 2, 16),
        bis: new Date(2022, 2, 20),
        piId: 2,
        sprintNumber: 2,
      },
      {
        von: new Date(2022, 2, 21),
        bis: new Date(2022, 2, 25),
        piId: 2,
        sprintNumber: 3,
      },
      {
        von: new Date(2022, 2, 26),
        bis: new Date(2022, 2, 28),
        piId: 2,
        sprintNumber: 4,
      },
      {
        von: new Date(2022, 3, 26),
        bis: new Date(2022, 3, 28),
        piId: 2,
        sprintNumber: 5,
      },
      {
        von: new Date(2022, 3, 15),
        bis: new Date(2022, 3, 16),
        piId: 2,
        sprintNumber: 6,
      },
      //PI-03
      {
        von: new Date(2022, 2, 10),
        bis: new Date(2022, 2, 15),
        piId: 3,
        sprintNumber: 1,
      },
      {
        von: new Date(2022, 2, 16),
        bis: new Date(2022, 2, 20),
        piId: 3,
        sprintNumber: 2,
      },
      {
        von: new Date(2022, 2, 21),
        bis: new Date(2022, 2, 25),
        piId: 3,
        sprintNumber: 3,
      },
      {
        von: new Date(2022, 2, 26),
        bis: new Date(2022, 2, 28),
        piId: 3,
        sprintNumber: 4,
      },
      {
        von: new Date(2022, 3, 26),
        bis: new Date(2022, 3, 28),
        piId: 3,
        sprintNumber: 5,
      },
      {
        von: new Date(2022, 3, 15),
        bis: new Date(2022, 3, 16),
        piId: 3,
        sprintNumber: 6,
      },
      //PI-04
      {
        von: new Date(2022, 2, 10),
        bis: new Date(2022, 2, 15),
        piId: 4,
        sprintNumber: 1,
      },
      {
        von: new Date(2022, 2, 16),
        bis: new Date(2022, 2, 20),
        piId: 4,
        sprintNumber: 2,
      },
      {
        von: new Date(2022, 2, 21),
        bis: new Date(2022, 2, 25),
        piId: 4,
        sprintNumber: 3,
      },
      {
        von: new Date(2022, 2, 26),
        bis: new Date(2022, 2, 28),
        piId: 4,
        sprintNumber: 4,
      },
      {
        von: new Date(2022, 3, 26),
        bis: new Date(2022, 3, 28),
        piId: 4,
        sprintNumber: 5,
      },
      {
        von: new Date(2021, 3, 15),
        bis: new Date(2021, 3, 16),
        piId: 4,
        sprintNumber: 6,
      },
      //2023
      //PI-01
      {
        von: new Date(2023, 2, 10),
        bis: new Date(2023, 2, 15),
        piId: 5,
        sprintNumber: 1,
      },
      {
        von: new Date(2023, 2, 16),
        bis: new Date(2023, 2, 20),
        piId: 5,
        sprintNumber: 2,
      },
      {
        von: new Date(2023, 2, 21),
        bis: new Date(2023, 2, 25),
        piId: 5,
        sprintNumber: 3,
      },
      {
        von: new Date(2023, 2, 26),
        bis: new Date(2023, 2, 28),
        piId: 5,
        sprintNumber: 4,
      },
      {
        von: new Date(2023, 3, 26),
        bis: new Date(2023, 3, 28),
        piId: 5,
        sprintNumber: 5,
      },
      {
        von: new Date(2023, 3, 15),
        bis: new Date(2023, 3, 16),
        piId: 5,
        sprintNumber: 6,
      },
      //Pi-02
      {
        von: new Date(2023, 2, 10),
        bis: new Date(2023, 2, 15),
        piId: 6,
        sprintNumber: 1,
      },
      {
        von: new Date(2023, 2, 16),
        bis: new Date(2023, 2, 20),
        piId: 6,
        sprintNumber: 2,
      },
      {
        von: new Date(2023, 2, 21),
        bis: new Date(2023, 2, 25),
        piId: 6,
        sprintNumber: 3,
      },
      {
        von: new Date(2023, 2, 26),
        bis: new Date(2023, 2, 28),
        piId: 6,
        sprintNumber: 4,
      },
      {
        von: new Date(2023, 3, 26),
        bis: new Date(2023, 3, 28),
        piId: 6,
        sprintNumber: 5,
      },
      {
        von: new Date(2023, 3, 15),
        bis: new Date(2023, 3, 16),
        piId: 6,
        sprintNumber: 6,
      },
      //PI-03
      {
        von: new Date(2023, 2, 10),
        bis: new Date(2023, 2, 15),
        piId: 7,
        sprintNumber: 1,
      },
      {
        von: new Date(2023, 2, 16),
        bis: new Date(2023, 2, 20),
        piId: 7,
        sprintNumber: 2,
      },
      {
        von: new Date(2023, 2, 21),
        bis: new Date(2023, 2, 25),
        piId: 7,
        sprintNumber: 3,
      },
      {
        von: new Date(2023, 2, 26),
        bis: new Date(2023, 2, 28),
        piId: 7,
        sprintNumber: 4,
      },
      {
        von: new Date(2023, 3, 26),
        bis: new Date(2023, 3, 28),
        piId: 7,
        sprintNumber: 5,
      },
      {
        von: new Date(2023, 3, 15),
        bis: new Date(2023, 3, 16),
        piId: 7,
        sprintNumber: 6,
      },
      //PI-04
      {
        von: new Date(2023, 2, 10),
        bis: new Date(2023, 2, 15),
        piId: 8,
        sprintNumber: 1,
      },
      {
        von: new Date(2023, 2, 16),
        bis: new Date(2023, 2, 20),
        piId: 8,
        sprintNumber: 2,
      },
      {
        von: new Date(2023, 2, 21),
        bis: new Date(2023, 2, 25),
        piId: 8,
        sprintNumber: 3,
      },
      {
        von: new Date(2023, 2, 26),
        bis: new Date(2023, 2, 28),
        piId: 8,
        sprintNumber: 4,
      },
      {
        von: new Date(2023, 3, 26),
        bis: new Date(2023, 3, 28),
        piId: 8,
        sprintNumber: 5,
      },
      {
        von: new Date(2023, 3, 15),
        bis: new Date(2023, 3, 16),
        piId: 8,
        sprintNumber: 6,
      },
    ],
  });
};

if (process.env.seed?.toLowerCase() === "true") {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  console.log(
    '\nSeeding is disabled. Set the "seed" environment variable to "true" to enable.'
  );
}

export default function seedDB() {
  main()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
