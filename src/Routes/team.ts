import express from "express";
import prisma from "../prisma/client";
import sendFileIfParamEqualsName from "../middleware/fileSender/fileSender";
import { type, userInfo } from "os";
import { AbwesenheitsTyp, User } from "@prisma/client";

interface Member{
  user: User,
  anwesendeTageProSprint: number[],
  kapazitaetProSprint: number[]
}

let router = express.Router();
var currentTime = new Date();

router.get('/', (req, res) => { res.redirect("team_kalender/" + new Date().getFullYear() + "/PI-01" ) });

router.get("/:year/:pi", sendFileIfParamEqualsName, async (req, res) => {
  const header = { currSite: 1, username: req.user.name };

  //Find current PI
  const pi = await prisma.pi.findUnique({
    where: {
      piKey: {
        year: req.params.year,
        iteration: req.params.pi,
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
  //Get Team name to id
  const currentUserTeam = await prisma.team.findFirst({
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
  let teamMembers:Member[] = [];
  for (let i = 0; i < _teamMembers.length; i++) {
    const teamMember = await prisma.user.findUnique({
      where: {
        sub: _teamMembers[i].userSub,
      },
    });
    if(teamMember){
      teamMembers.push({
        user: teamMember,
        anwesendeTageProSprint: [],
        kapazitaetProSprint: []
      });
    }
  }  

  let vogaengerVelocity = 80; 

  const kapazitaetProSprint: number[] = [];
  const tageProSprint: number[] = [];
  const velocitiesProSprint: number[] = [];

  //Tage pro Sprint berechnen
  for(const sprint of sprintsInPi){  
    let totalDaysInTeam = 0;  
    let daysWithUserProductivity = 0;  
    const daysInSprint = Math.abs((sprint.von.getTime() - sprint.bis.getTime()) / (1000 * 3600 * 24)) + 1;
    for (const member of teamMembers) {
      const abwesenheiten = await getAbwesenheitenInDateRange(sprint.von, sprint.bis, member.user.sub)
      let usersDaysInSprint = daysInSprint;
      for(const date = new Date(sprint.von); date <= sprint.bis; date.setDate(date.getDate() + 1)){      
        if(member.user.standardAbwesenheiten.includes(date.getDay())){
          if(abwesenheiten){
            usersDaysInSprint = abwesenheiten.filter(a => a.date == date.getTime() && a.typ === "anwesend").length !== 0 ? usersDaysInSprint : usersDaysInSprint - 1;
            usersDaysInSprint = abwesenheiten.filter(a => a.date == date.getTime() && a.typ === "halbAbwesend").length !== 0 ? usersDaysInSprint + 0.5 : usersDaysInSprint;
          }else{
            usersDaysInSprint--;
          }
        }else{
          if(abwesenheiten){
            usersDaysInSprint = abwesenheiten.filter(a => a.date == date.getTime() && a.typ === "abwesend").length !== 0 ? usersDaysInSprint - 1 : usersDaysInSprint;
            usersDaysInSprint = abwesenheiten.filter(a => a.date == date.getTime() && a.typ === "halbAbwesend").length !== 0 ? usersDaysInSprint - 0.5 : usersDaysInSprint;
          }
        }
      }
      member.anwesendeTageProSprint.push(usersDaysInSprint);
      totalDaysInTeam += usersDaysInSprint;
      daysWithUserProductivity += Math.round(usersDaysInSprint * (member.user.productivityPercentage / 100) * 2) / 2;
    }    
    tageProSprint.push(totalDaysInTeam)
    const velocity = Math.round(vogaengerVelocity + (daysWithUserProductivity) / daysWithUserProductivity ) ;
    velocitiesProSprint.push(velocity)
    vogaengerVelocity = velocity;
    kapazitaetProSprint.push(Math.round(daysWithUserProductivity * (vogaengerVelocity / 100)))
  }

  const umges: number[] = kapazitaetProSprint.map(a => a + 1);



  if (
    parseInt(req.params.year) >= 2020 &&
    parseInt(req.params.year) <= 2100 &&
    (req.params.pi == "PI-01" ||
      req.params.pi == "PI-02" ||
      req.params.pi == "PI-03" ||
      req.params.pi == "PI-04")
  ) {
    res.render("team_kalender", {
      piIsDefined: pi === null ? false : true,
      header,
      prefersWhiteMode: req.user.prefersWhiteMode,
      params: req.params,
      teamName: currentUserTeam?.teamName,
      tageProSprint: tageProSprint,
      kapazitaet: kapazitaetProSprint, //Kapazität
      umgesetzteStorypoints: umges,
      velocitiesProSprint: velocitiesProSprint,
      teamMembers: teamMembers,
    });
  } else {
    res.redirect("/team_kalender/" + currentTime.getFullYear() + "/PI-01");
  }

});

async function getAbwesenheitenInDateRange(von: Date, bis: Date, userSub: string): Promise<void | { date: any, typ: AbwesenheitsTyp }[]> {
  try {
      const abwesenheiten = await prisma.abwesenheit.findMany({
          where: {
              userSub: userSub,
              AND: {
                  date: {
                      gte: von,
                      lt: bis
                  },
              }
          }
      });
      return abwesenheiten.map(abwesenheit => {
          return {
              date: new Date(abwesenheit.date.getFullYear(),abwesenheit.date.getMonth(), abwesenheit.date.getDate(), 1 ,0 ,0).getTime(),
              typ: abwesenheit.typ
          };
      });
  } catch (err) {
      console.log(err);
      return [];
  }
}

export = router;
