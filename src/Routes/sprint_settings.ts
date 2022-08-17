import express from "express";
import path from "path";
import sendFileIfParamEqualsName from "../middleware/fileSender/fileSender";
import prisma from "../prisma/client";

let router = express.Router();
var currentTime = new Date();

//Read
router.get("/:year/:pi", sendFileIfParamEqualsName, async (req, res) => {
  if(req.user.role == "dev"){
    res.send("No Access")
  }
  else{
    let parent = 2;
    if (req.headers.referer?.includes("mein_kalender")){ parent = 1; }    
    if(req.params.pi.length > 1){
      req.params.pi = req.params.pi.slice(4,5);
    }
    if (
      Number(req.params.year) >= 2020 &&
      Number(req.params.year) <= 2100 &&
      (Number(req.params.pi) <= 4 && Number(req.params.pi) >= 1)
    ) {
      //PI nach Parameter suchen
      const pi = await prisma.pi.findUnique({
        where: {
          piKey: {
            year: Number(req.params.year),
            iteration: Number(req.params.pi),
          },
        },
      });
      let sprintsInPi;
      if (pi !== null) {
        //Sprints Finden
        sprintsInPi = await prisma.sprint.findMany({
          where: {
            piId: pi.id,
          },
        });
      }
      res.render("sprint_verwaltung", {
        params: req.params,
        sprints: sprintsInPi,
        pi: pi,
        prefersWhiteMode: req.user.prefersWhiteMode,
        parent,
      });
    } else {
      res.redirect(
        "/sprint_verwaltung/" + currentTime.getFullYear() + "/PI-01",
      );
    }
  }
});
//Update
router.post("/:year/:pi", async (req, res) => {
  if (req.body.planungStart !== "" && req.body.planungEnde !== "") {
    if (
      parseInt(req.params.year) >= 2020 &&
      parseInt(req.params.year) <= 2100 &&
      (Number(req.params.pi) <= 4 && Number(req.params.pi) >= 1)
    ) {
      //Planungstage Updaten
      const updatedPlanningDates = await prisma.pi.upsert({
        where: {
          piKey: {
            year: Number(req.params.year),
            iteration: Number(req.params.pi),
          },
        },
        update: {
          planungVon: req.body.planungStart + "T00:00:00.000Z",
          planungBis: req.body.planungEnde + "T00:00:00.000Z",
        },
        create: {
          year: Number(req.params.year),
          iteration: Number(req.params.pi),
          planungVon: req.body.planungStart + "T00:00:00.000Z",
          planungBis: req.body.planungEnde + "T00:00:00.000Z",
        },
      });
      //Einzelne Sprints updaten
      for (let i = 1; i <= 6; i++) {
        if (updatedPlanningDates !== null) {
          const updateSprint = await prisma.sprint.upsert({
            where: {
              sprintKey: {
                piId: updatedPlanningDates.id,
                sprintNumber: i,
              },
            },
            update: {
              von: req.body.start[i - 1] + "T00:00:00.000Z",
              bis: req.body.ende[i - 1] + "T00:00:00.000Z",
            },
            create: {
              piId: updatedPlanningDates.id,
              sprintNumber: i,
              von: req.body.start[i - 1] + "T00:00:00.000Z",
              bis: req.body.ende[i - 1] + "T00:00:00.000Z",
            },
          });
        }
      }
      res.redirect(
        "/sprint_verwaltung/" + req.params.year + "/" + req.params.pi,
      );
    } else {
      console.log("Params not valid");
    }
  } else {
    res.status(400);
  }
});

export = router;
