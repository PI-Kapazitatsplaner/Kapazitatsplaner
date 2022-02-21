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
  for(let i = 1; i <= 6; i++){
    if (findCurrentPi !== null) {
      const updateSprint = await prisma.sprint.update({
        where: {
          sprintKey: {
            piId: findCurrentPi.id,
            sprintNumber: i,
          },
        },
        data: {
          von: req.body.start[i-1] + "T00:00:00.000Z",
          bis: req.body.ende[i-1] + "T00:00:00.000Z",
        },
      });
    }
  }
  res.redirect("/sprint_verwaltung/" + req.params.year + "/" + req.params.pi);
});

export = router;
