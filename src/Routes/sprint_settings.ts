import express from "express";
import prisma from "../prisma/client";

let router = express.Router();
var currentTime = new Date();

//Read
router.get("/:year?/:pi?", async (req, res) => {
  if (validateParams(req.params)) {
    req.params.pi = req.params.pi ? req.params.pi.length > 1 ? req.params.pi.slice(4, 5) : req.params.pi : "";
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
    });
  } else {
    res.redirect(
      "/sprint_verwaltung/" + currentTime.getFullYear() + "/PI-01",
    );
  }
});
//Update
router.post("/:year/:pi", async (req, res) => {
  if (req.body.planungStart !== "" && req.body.planungEnde !== "") {
    if (validateParams(req.params)) {
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

function validateParams(params: any): Boolean {
  return (!(params.year === undefined || params.pi === undefined) &&
    Number(params.year) >= 2020 && Number(params.year) < 2100 &&
    (Number(params.pi.length > 1 ? params.pi.slice(4, 5) : params.pi) <= 4 &&
      Number(params.pi.length > 1 ? params.pi.slice(4, 5) : params.pi) >= 1));
}

export = router;
