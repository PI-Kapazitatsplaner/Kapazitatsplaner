import express, { query } from "express";
import path from "path";

import { PrismaClient } from "@prisma/client";
import { parse } from "path/posix";
const prisma = new PrismaClient();

let router = express.Router();
var currentTime = new Date();

//Read
router.get("/:year/:pi", async (req, res) => {
  if (req.params.pi?.match(/^.*.js|.*.css$/)) {
    res.sendFile(path.join(__dirname, "../Public", req.params.pi));
  } else {
    if (
      parseInt(req.params.year) >= 2020 &&
      parseInt(req.params.year) <= 2100 &&
      (req.params.pi == "PI-01" ||
        req.params.pi == "PI-02" ||
        req.params.pi == "PI-03" ||
        req.params.pi == "PI-04")
    ) {
      //PI nach Parameter suchen
      const pi = await prisma.pi.findUnique({
        where: {
          piKey: {
            year: req.params.year,
            iteration: req.params.pi,
          },
        },
      });
      if (pi !== null && pi.planungVon !== null) {
        //Sprints Finden
        const sprintsInPi = await prisma.sprint.findMany({
          where: {
            piId: Number(pi.iteration.charAt(4)),
          },
        });
        res.render("sprint_verwaltung", {
          params: req.params,
          sprints: sprintsInPi,
          pi: pi,
        });
      } else {
        res.redirect(
          "/sprint_verwaltung/" + currentTime.getFullYear() + "/PI-01"
        );
      }
    } else {
      res.redirect(
        "/sprint_verwaltung/" + currentTime.getFullYear() + "/PI-01"
      );
    }
  }
});
//Update
router.post("/:year/:pi", async (req, res) => {
  //Planungstage Updaten
  const updatePlanningDates = await prisma.pi.update({
    where: {
      piKey: {
        year: req.params.year,
        iteration: req.params.pi,
      },
    },
    data: {
      planungVon: req.body.planungStart + "T00:00:00.000Z",
      planungBis: req.body.planungEnde + "T00:00:00.000Z",
    },
  });
  //Pi Finden
  const findCurrentPi = await prisma.pi.findUnique({
    where: {
      piKey: {
        year: req.params.year,
        iteration: req.params.pi,
      },
    },
  });
  //Einzelne Sprints updaten
  if (req.params.pi === "PI-01") {
    if (findCurrentPi !== null) {
      const updateSprint1 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 1,
          },
        },
        data: {
          von: req.body.start11 + "T00:00:00.000Z",
          bis: req.body.ende11 + "T00:00:00.000Z",
        },
      });
      const updateSprint2 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 2,
          },
        },
        data: {
          von: req.body.start12 + "T00:00:00.000Z",
          bis: req.body.ende12 + "T00:00:00.000Z",
        },
      });
      const updateSprint3 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 3,
          },
        },
        data: {
          von: req.body.start13 + "T00:00:00.000Z",
          bis: req.body.ende13 + "T00:00:00.000Z",
        },
      });
      const updateSprint4 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 4,
          },
        },
        data: {
          von: req.body.start14 + "T00:00:00.000Z",
          bis: req.body.ende14 + "T00:00:00.000Z",
        },
      });
      const updateSprint5 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 5,
          },
        },
        data: {
          von: req.body.start15 + "T00:00:00.000Z",
          bis: req.body.ende15 + "T00:00:00.000Z",
        },
      });
      const updateSprint6 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 6,
          },
        },
        data: {
          von: req.body.start16 + "T00:00:00.000Z",
          bis: req.body.ende16 + "T00:00:00.000Z",
        },
      });
    }
  }
  else if(req.params.pi === "PI-02"){
    if (findCurrentPi !== null) {
      const updateSprint1 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 1,
          },
        },
        data: {
          von: req.body.start21 + "T00:00:00.000Z",
          bis: req.body.ende21 + "T00:00:00.000Z",
        },
      });
      const updateSprint2 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 2,
          },
        },
        data: {
          von: req.body.start22 + "T00:00:00.000Z",
          bis: req.body.ende22 + "T00:00:00.000Z",
        },
      });
      const updateSprint3 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 3,
          },
        },
        data: {
          von: req.body.start23 + "T00:00:00.000Z",
          bis: req.body.ende23 + "T00:00:00.000Z",
        },
      });
      const updateSprint4 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 4,
          },
        },
        data: {
          von: req.body.start24 + "T00:00:00.000Z",
          bis: req.body.ende24 + "T00:00:00.000Z",
        },
      });
      const updateSprint5 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 5,
          },
        },
        data: {
          von: req.body.start25 + "T00:00:00.000Z",
          bis: req.body.ende25 + "T00:00:00.000Z",
        },
      });
      const updateSprint6 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 6,
          },
        },
        data: {
          von: req.body.start26 + "T00:00:00.000Z",
          bis: req.body.ende26 + "T00:00:00.000Z",
        },
      });
    }
  }
  else if(req.params.pi === "PI-03"){
    if (findCurrentPi !== null) {
      const updateSprint1 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 1,
          },
        },
        data: {
          von: req.body.start31 + "T00:00:00.000Z",
          bis: req.body.ende31 + "T00:00:00.000Z",
        },
      });
      const updateSprint2 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 2,
          },
        },
        data: {
          von: req.body.start32 + "T00:00:00.000Z",
          bis: req.body.ende32 + "T00:00:00.000Z",
        },
      });
      const updateSprint3 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 3,
          },
        },
        data: {
          von: req.body.start33 + "T00:00:00.000Z",
          bis: req.body.ende33 + "T00:00:00.000Z",
        },
      });
      const updateSprint4 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 4,
          },
        },
        data: {
          von: req.body.start34 + "T00:00:00.000Z",
          bis: req.body.ende34 + "T00:00:00.000Z",
        },
      });
      const updateSprint5 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 5,
          },
        },
        data: {
          von: req.body.start35 + "T00:00:00.000Z",
          bis: req.body.ende35 + "T00:00:00.000Z",
        },
      });
      const updateSprint6 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 6,
          },
        },
        data: {
          von: req.body.start36 + "T00:00:00.000Z",
          bis: req.body.ende36 + "T00:00:00.000Z",
        },
      });
    }
  }
  else if(req.params.pi === "PI-04"){
    if (findCurrentPi !== null) {
      const updateSprint1 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 1,
          },
        },
        data: {
          von: req.body.start41 + "T00:00:00.000Z",
          bis: req.body.ende41 + "T00:00:00.000Z",
        },
      });
      const updateSprint2 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 2,
          },
        },
        data: {
          von: req.body.start42 + "T00:00:00.000Z",
          bis: req.body.ende42 + "T00:00:00.000Z",
        },
      });
      const updateSprint3 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 3,
          },
        },
        data: {
          von: req.body.start43 + "T00:00:00.000Z",
          bis: req.body.ende43 + "T00:00:00.000Z",
        },
      });
      const updateSprint4 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 4,
          },
        },
        data: {
          von: req.body.start44 + "T00:00:00.000Z",
          bis: req.body.ende44 + "T00:00:00.000Z",
        },
      });
      const updateSprint5 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 5,
          },
        },
        data: {
          von: req.body.start45 + "T00:00:00.000Z",
          bis: req.body.ende45 + "T00:00:00.000Z",
        },
      });
      const updateSprint6 = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: 6,
          },
        },
        data: {
          von: req.body.start46 + "T00:00:00.000Z",
          bis: req.body.ende46 + "T00:00:00.000Z",
        },
      });
    }
  }
  res.redirect("/sprint_verwaltung/" + req.params.year + "/" + req.params.pi);
});

export = router;
