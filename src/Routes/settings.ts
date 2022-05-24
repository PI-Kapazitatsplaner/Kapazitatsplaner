import { log } from "console";
import express from "express";
import { uptime } from "process";
import { convertCompilerOptionsFromJson } from "typescript";
import prisma from "../prisma/client";

let router = express.Router();

router.get("/", async (req, res) => {
  let userTeams = [];
  let userTeamPercentage = [];
  if (req.user.sub) {
    const user_team = await prisma.user_Team.findMany({
      where: {
        userSub: req.user.sub,
      },
    });
    for (let i = 0; i < user_team.length; i++) {
      let usersTeam = await prisma.team.findUnique({
        where: {
          id: user_team[i].teamId,
        },
      });
      userTeamPercentage.push(user_team[i].productivityPercentage);
      userTeams.push(usersTeam);
    }
  }

  let parent = 2;
  if (req.headers.referer?.includes("mein_kalender")) {
    parent = 1;
  }
  res.render("settings", {
    prefersWhiteMode: req.user.prefersWhiteMode,
    productivity: userTeamPercentage,
    standardAbwesenheiten: req.user.standardAbwesenheiten,
    csrfToken: req.csrfToken(),
    teams: userTeams,
    parent,
    addTeam: false,
  });
});

router.get("/add", async (req, res) => {
  let userTeams = [];
  let userTeamPercentage = [];
  if (req.user.sub) {
    const user_team = await prisma.user_Team.findMany({
      where: {
        userSub: req.user.sub,
      },
    });
    for (let i = 0; i < user_team.length; i++) {
      let usersTeam = await prisma.team.findUnique({
        where: {
          id: user_team[i].teamId,
        },
      });
      userTeamPercentage.push(user_team[i].productivityPercentage);
      userTeams.push(usersTeam);
    }
  }

  let parent = 2;
  if (req.headers.referer?.includes("mein_kalender")) {
    parent = 1;
  }
  res.render("settings", {
    prefersWhiteMode: req.user.prefersWhiteMode,
    productivity: userTeamPercentage,
    standardAbwesenheiten: req.user.standardAbwesenheiten,
    csrfToken: req.csrfToken(),
    teams: userTeams,
    parent,
    addTeam: true,
  });
});

router.get("/delete/:teamName", async (req, res) => {
  const team = await prisma.team.findUnique({
    where: {
      teamName: req.params.teamName,
    },
  });
  if (team) {
    await prisma.user_Team.delete({
      where: {
        user_teamKey: {
          teamId: team?.id,
          userSub: req.user.sub,
        },
      },
    });
  }
  res.redirect("/settings");
});

router.post("/add", async (req, res) => {
  await saveSettings(req);
  res.redirect("/settings/add");
});

router.post("/", async (req, res) => {
  await saveSettings(req);
  res.redirect("/settings");
});

async function saveSettings(req: any) {
  let standardAbwesenheiten;
  if (req.body.standardAbwesenheiten === undefined) {
    standardAbwesenheiten = [];
  } else if (typeof req.body.standardAbwesenheiten === "string") {
    standardAbwesenheiten = parseInt(req.body.standardAbwesenheiten);
  } else {
    standardAbwesenheiten = req.body.standardAbwesenheiten.map((el: string) =>
      parseInt(el)
    );
  }
  let prefersWhiteMode;
  if (req.body.theme === "light") {
    prefersWhiteMode = true;
  } else if (req.body.theme === "dark") {
    prefersWhiteMode = false;
  }
  await prisma.user.update({
    where: {
      sub: req.user.sub,
    },
    data: {
      standardAbwesenheiten: standardAbwesenheiten,
      preferencesWhiteMode: prefersWhiteMode,
    },
  });
  const user_teams = await prisma.user_Team.findMany({
    where: {
      userSub: req.user.sub,
    },
  });
  if(req.body.productivity != undefined && req.body.productivity instanceof Array) {
    for (let i = 0; i < user_teams.length; i++) {
      await prisma.user_Team.update({
        where: {
          user_teamKey: {
            teamId: user_teams[i].teamId,
            userSub: req.user.sub,
          },
        },
        data: {
          productivityPercentage: Number(req.body.productivity[i]),
        },
      });
    }
  }
  else if(req.body.productivity != undefined && !(req.body.productivity instanceof Array)) {
    await prisma.user_Team.update({
      where: {
        user_teamKey: {
          teamId: user_teams[0].teamId,
          userSub: req.user.sub,
        },
      },
      data: {
        productivityPercentage: Number(req.body.productivity),
      },
    });
  }
  

  if (req.body.newTeam) {
    const team = await prisma.team.upsert({
      where: {
        teamName: req.body.newTeam,
      },
      update: {},
      create: {
        teamName: req.body.newTeam,
      },
    });
    if (team && user_teams.map((ut) => ut.teamId).includes(team.id) === false) {
      await prisma.user_Team.create({
        data: {
          userSub: req.user.sub,
          teamId: team.id,
          productivityPercentage:
            Number(req.body.newPercentage) === NaN
              ? 0
              : Number(req.body.newPercentage),
        },
      });
    }
  }
}

export = router;
