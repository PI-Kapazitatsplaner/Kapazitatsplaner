import express from "express";
import prisma from "../prisma/client";
import sendFileIfParamEqualsName from "../middleware/fileSender/fileSender";
import { AbwesenheitsTyp, Pi, User } from "@prisma/client";

interface Member {
  user: User;
  productivityPercentage: number;
  anwesendeTageProSprint: number[];
  kapazitaetProSprint: number[];
}

interface Team {
  teamId: number;
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
  res.redirect("/team_kalender/" + new Date().getFullYear() + "/PI-01");
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

  //Find Teams to current user
  const currentUserTeams = await prisma.user_Team.findMany({
      where: {
        userSub: req.user.sub,
      },
    });
    if (currentUserTeams) {
      let usersTeams: Team[] = [];

      //Get Feiertage
      const feiertage = await prisma.feiertag.findMany({}).then((feiertage) => {
        return feiertage.map((feiertag) => {
          return feiertag.datum.getTime()
        });
      })

      for (const team of currentUserTeams) {
          //Get Team name to id
        const currentUserTeam = await prisma.team.findUnique({
          where: {
            id: team?.teamId,
          },
        });
        //Get Team members ID
        const user_Teams = await prisma.user_Team.findMany({
          where: {
            teamId: team?.teamId,
          },
        });
        //Get Team members by team
        let teamMembers:Member[] = [];
        for (let i = 0; i < user_Teams.length; i++) {
          const teamMember = await prisma.user.findUnique({
            where: {
              sub: user_Teams[i].userSub,
            },
          }); 
          const productivityPercentage = await prisma.user_Team.findUnique({
            where: {
              user_teamKey:{
                userSub: user_Teams[i].userSub,
                teamId: team?.teamId,
              }
            },
          }).then(user_team => user_team?.productivityPercentage);

          if(teamMember){
              teamMembers.push({
                user: teamMember,
                productivityPercentage: productivityPercentage ? productivityPercentage : 0,
                anwesendeTageProSprint: [],
                kapazitaetProSprint: [],
              });
            }
        } 
        //Get Previous PI
        let previousPi: Pi | null = null;
        if(pi){
          previousPi = await prisma.pi.findUnique({
            where: {
              piKey:{
                iteration: pi.iteration - 1 === 0 ? 4 : pi.iteration - 1,
                year: pi.iteration - 1 === 0 ? pi.year - 1 : pi.year,
              }
            }
          });
        }

        //Get Previous Sprint
        let vorgaengerSprintId;
        if(previousPi){
          vorgaengerSprintId = await prisma.sprint.findUnique({
            where: {
              sprintKey: {
                piId: previousPi.id,
                sprintNumber: 6
              }
            }
          }).then(sprint => sprint?.id);
        }        
        
        let vorgaengerVelocity: number = 80
        if(pi && team && vorgaengerSprintId){
          vorgaengerVelocity = await prisma.sprintTeam.findUnique({
            where: {
              sprintTeamKey: {
                teamId: team.teamId,
                sprintId: vorgaengerSprintId,
              }
            }
          }).then(sprint => sprint?.endVelocity || 80);  
        }
        

      const kapazitaetProSprint: number[] = [];
      const tageProSprint: number[] = [];
      const velocitiesProSprint: number[] = [];
      const umgesetzteStorypoints: number[] = [];

      let sprintNumber = 1;
      //Tage pro Sprint berechnen
      for (const sprint of sprintsInPi) {
        let totalDaysInTeam = 0;
        let daysWithUserProductivity = 0;
        const daysInSprint = Math.abs(
          (sprint.von.getTime() - sprint.bis.getTime()) / (1000 * 3600 * 24),
        ) + 1;
        //Jeder Team member
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
            if (member.user.standardAbwesenheiten.includes(date.getDay()) || 
              feiertage.includes(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0 ,0).getTime())) {
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
            usersDaysInSprint * (member.productivityPercentage / 100) * 2,
          ) / 2;

        }
        tageProSprint.push(totalDaysInTeam);
        kapazitaetProSprint.push(
          Math.round(daysWithUserProductivity * (vorgaengerVelocity / 100)),
        );

        let umgesetzteStorypointsInSprint = undefined;

        umgesetzteStorypointsInSprint = await prisma.sprintTeam.findUnique({
          where: {
            sprintTeamKey: {
              sprintId: sprint.id,
              teamId: team.teamId,
            },
          },
        }).then((res) => res?.umgesetzteStorypoints);

        let velocity = vorgaengerVelocity;
        
        if (umgesetzteStorypointsInSprint !== undefined && umgesetzteStorypointsInSprint !== null) {
          if(kapazitaetProSprint[kapazitaetProSprint.length - 1] > 0){
            velocity = Math.round(
              (sprintNumber * vorgaengerVelocity +
              (umgesetzteStorypointsInSprint / kapazitaetProSprint[kapazitaetProSprint.length - 1] * 100)) / (sprintNumber + 1)
            );
          }
          umgesetzteStorypoints.push(umgesetzteStorypointsInSprint);
        } else {
          umgesetzteStorypoints.push(
            0
          );
        }
                
        velocitiesProSprint.push(velocity);
        vorgaengerVelocity = velocity;
        
        if(sprintNumber === 6){
        
          await prisma.sprintTeam.upsert({
            where: {
              sprintTeamKey: {
                sprintId: sprint.id,
                teamId: team.teamId,
              },
            },
            create: {
              sprintId: sprint.id,
              teamId: team.teamId,
              endVelocity: velocity,
            },
            update: {
              endVelocity: velocity,
            },
          });
        }

        sprintNumber++
      }

      if (currentUserTeam) {
        usersTeams.push({
          teamId: currentUserTeam.id,
          teamName: currentUserTeam?.teamName,
          teamMembers: teamMembers,
          kapazitaetProSprint: kapazitaetProSprint.map((k) =>isNaN(k) ? 0 : k),
          tageProSprint: tageProSprint.map((k) =>isNaN(k) ? 0 : k),
          velocitiesProSprint: velocitiesProSprint.map((k) =>isNaN(k) ? 0 : k),
          umgesetzteStorypoints: umgesetzteStorypoints.map((k) =>isNaN(k) ? 0 : k),
        });
      }
      }
      res.render("team_kalender", {
        piIsDefined: pi === null ? false : true,
        header,
        prefersWhiteMode: req.user.prefersWhiteMode,
        params: req.params,
        userTeams: usersTeams,
        noTeam: false,
        sprints: sprintsInPi,
      });
    } else {
      res.render("team_kalender", {
        piIsDefined: pi === null ? false : true,
        header,
        prefersWhiteMode: req.user.prefersWhiteMode,
        params: req.params,
        noTeam: true,
        sprints: sprintsInPi,
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
