import express from "express";
import prisma from "../prisma/client";
import sendFileIfParamEqualsName from "../middleware/fileSender/fileSender";
import { AbwesenheitsTyp, User } from "@prisma/client";
import { listenerCount } from "process";

interface Member {
  user: User;
  anwesendeTageProSprint: number[];
  kapazitaetProSprint: number[];
}

interface Team {
  teamName: string;
  tageProSprint: number[];
  kapazitaetProSprint: number[];
  umgesetzteStorypoints: number[];
  velocitiesProSprint: number[];
  teamMembers: Member[];
}

let router = express.Router();
var currentTime = new Date();

router.get("/", (req, res) => {
  res.redirect("/team_kalender/" + new Date().getFullYear() + "/1");
});

router.get("/:year/:pi", sendFileIfParamEqualsName, async (req, res) => {
  const header = { currSite: 1, username: req.user.name };
  if (req.params.pi.length > 1) {
    req.params.pi = req.params.pi.slice(4, 5);
  }
  if (
    Number(req.params.year) >= 2020 &&
    Number(req.params.year) <= 2100 &&
    (Number(req.params.pi) <= 4 && Number(req.params.pi) >= 1)
  ) {
    //Find current PI
    const pi = await prisma.pi.findUnique({
      where: {
        piKey: {
          year: Number(req.params.year),
          iteration: Number(req.params.pi),
        },
      },
    });

    //Sprints finden
    const sprintsInPi = await prisma.sprint.findMany({
      where: {
        piId: pi?.id,
      },
    });

    //Find Team to current user
    const _currentUserTeam = await prisma.user_Team.findFirst({
      where: {
        userSub: req.user.sub,
      },
    });
    if (_currentUserTeam) {
      //Get Team name to id
      const currentUserTeam = await prisma.team.findUnique({
        where: {
          id: _currentUserTeam?.teamId,
        },
      });
      //Get Team members ID
      const _teamMembers = await prisma.user_Team.findMany({
        where: {
          teamId: _currentUserTeam?.teamId,
        },
      });

      //Get Team members
      let teamMembers: Member[] = [];
      for (let i = 0; i < _teamMembers.length; i++) {
        const teamMember = await prisma.user.findUnique({
          where: {
            sub: _teamMembers[i].userSub,
          },
        });
        if (teamMember) {
          teamMembers.push({
            user: teamMember,
            anwesendeTageProSprint: [],
            kapazitaetProSprint: [],
          });
        }
      }

      let vogaengerVelocity = 80;

      const kapazitaetProSprint: number[] = [];
      const tageProSprint: number[] = [];
      const velocitiesProSprint: number[] = [];
      const umgesetzteStorypoints: number[] = [];

      //Tage pro Sprint berechnen
      for (const sprint of sprintsInPi) {
        let totalDaysInTeam = 0;
        let daysWithUserProductivity = 0;
        const daysInSprint = Math.abs(
          (sprint.von.getTime() - sprint.bis.getTime()) / (1000 * 3600 * 24),
        ) + 1;
        for (const member of teamMembers) {
          const abwesenheiten = await getAbwesenheitenInDateRange(
            sprint.von,
            sprint.bis,
            member.user.sub,
          );
          let usersDaysInSprint = daysInSprint;
          for (
            const date = new Date(sprint.von);
            date <= sprint.bis;
            date.setDate(date.getDate() + 1)
          ) {
            if (member.user.standardAbwesenheiten.includes(date.getDay())) {
              if (abwesenheiten) {
                usersDaysInSprint = abwesenheiten.filter((a) =>
                    a.date == date.getTime() && a.typ === "anwesend"
                  ).length !== 0
                  ? usersDaysInSprint
                  : usersDaysInSprint - 1;
                usersDaysInSprint = abwesenheiten.filter((a) =>
                    a.date == date.getTime() && a.typ === "halbAbwesend"
                  ).length !== 0
                  ? usersDaysInSprint + 0.5
                  : usersDaysInSprint;
              } else {
                usersDaysInSprint--;
              }
            } else {
              if (abwesenheiten) {
                usersDaysInSprint = abwesenheiten.filter((a) =>
                    a.date == date.getTime() && a.typ === "abwesend"
                  ).length !== 0
                  ? usersDaysInSprint - 1
                  : usersDaysInSprint;
                usersDaysInSprint = abwesenheiten.filter((a) =>
                    a.date == date.getTime() && a.typ === "halbAbwesend"
                  ).length !== 0
                  ? usersDaysInSprint - 0.5
                  : usersDaysInSprint;
              }
            }
          }
          member.anwesendeTageProSprint.push(usersDaysInSprint);
          totalDaysInTeam += usersDaysInSprint;
          daysWithUserProductivity += Math.round(
            usersDaysInSprint * (member.user.productivityPercentage / 100) * 2,
          ) / 2;
        }
        tageProSprint.push(totalDaysInTeam);
        kapazitaetProSprint.push(
          Math.round(daysWithUserProductivity * (vogaengerVelocity / 100)),
        );

        let umgesetzteStorypointsInSprint = undefined;

        umgesetzteStorypointsInSprint = await prisma.sprintTeam.findUnique({
          where: {
            sprintTeamKey: {
              sprintId: sprint.id,
              teamId: _currentUserTeam.teamId,
            },
          },
        }).then((res) => res?.umgesetzteStorypoints);
        if (umgesetzteStorypointsInSprint) {
          umgesetzteStorypoints.push(umgesetzteStorypointsInSprint);
        } else {
          umgesetzteStorypoints.push(
            kapazitaetProSprint[kapazitaetProSprint.length - 1],
          );
        }
        
        const velocity = Math.round(
          (vogaengerVelocity +
          (umgesetzteStorypoints[umgesetzteStorypoints.length - 1] / kapazitaetProSprint[kapazitaetProSprint.length - 1] * 100)) / 2
        );
        velocitiesProSprint.push(velocity);
        vogaengerVelocity = velocity;
      }

      res.render("team_kalender", {
        piIsDefined: pi === null ? false : true,
        header,
        prefersWhiteMode: req.user.prefersWhiteMode,
        params: req.params,
        teamName: currentUserTeam?.teamName,
        tageProSprint: tageProSprint,
        kapazitaet: kapazitaetProSprint, //Kapazität
        umgesetzteStorypoints: umgesetzteStorypoints,
        velocitiesProSprint: velocitiesProSprint,
        teamMembers: teamMembers,
        noTeam: false,
      });
    } else {
      res.render("team_kalender", {
        piIsDefined: pi === null ? false : true,
        header,
        prefersWhiteMode: req.user.prefersWhiteMode,
        params: req.params,
        noTeam: true,
      });
    }
  } else {
    res.redirect("/team_kalender/" + currentTime.getFullYear() + "/PI-01");
  }
});

router.post(
  "/:year/:pi/:sprint",
  sendFileIfParamEqualsName,
  async (req, res) => {
    if (validateBody(req.body) && validateParams(req.params)) {
      
      const piId = await prisma.pi.findUnique({
        where: {
          piKey: {
            year: Number(req.params.year),
            iteration: Number(req.params.pi),
          },
        },
      }).then((pi) => pi?.id);      

      if (piId) {
        const sprintId = await prisma.sprint.findUnique({
          where: {
            sprintKey: {
              piId: piId,
              sprintNumber: Number(req.params.sprint),
            },
          },
        }).then((s) => s?.id);
        if (sprintId) {
          await prisma.sprintTeam.upsert({
            where: {
              sprintTeamKey: {
                sprintId: sprintId,
                teamId: Number(req.body.teamId),
              },
            },
            create: {
              sprintId: sprintId,
              teamId: Number(req.body.teamId),
              umgesetzteStorypoints: Number(req.body.usp),
            },
            update: {
              umgesetzteStorypoints: Number(req.body.usp),
            },
          });
        }
      }
      res.redirect("/team_kalender/" + req.params.year + "/" + req.params.pi);
    } else {
      res.send("Invalid request");
    }
  },
);

function validateParams(params: any): Boolean {
  return (!(params.year === undefined || params.pi === undefined ||
    params.sprint === undefined) &&
    Number(params.year) >= 2020 && Number(params.year) < 2100 &&
    Number(params.pi) >= 1 && Number(params.pi) <= 4 &&
    Number(params.sprint) >= 1 && Number(params.sprint) <= 6);
}

function validateBody(body: any): Boolean {
  return body.usp !== undefined && body.usp >= 0 && body.teamId !== undefined;
}

async function getAbwesenheitenInDateRange(
  von: Date,
  bis: Date,
  userSub: string,
): Promise<void | { date: any; typ: AbwesenheitsTyp }[]> {
  try {
    const abwesenheiten = await prisma.abwesenheit.findMany({
      where: {
        userSub: userSub,
        AND: {
          date: {
            gte: von,
            lt: bis,
          },
        },
      },
    });
    return abwesenheiten.map((abwesenheit) => {
      return {
        date: new Date(
          abwesenheit.date.getFullYear(),
          abwesenheit.date.getMonth(),
          abwesenheit.date.getDate(),
          1,
          0,
          0,
        ).getTime(),
        typ: abwesenheit.typ,
      };
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}

export = router;
