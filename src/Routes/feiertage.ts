import prisma from "../prisma/client";
import express from "express";

let router = express.Router();

router.get("/:parent/:year", async (req, res) => {
  const feiertage = await prisma.feiertag.findMany({
    where: {
      von: {
        gte: new Date(req.params.year + "-01-01"),
        lte: new Date(req.params.year + "-12-31"),
      },
    }
  });
  res.render("feiertage_verwaltung", {
    parent: req.params.parent,
    feiertage: feiertage,
    addTeam: false,
    params: req.params,
  });
});

router.get("/:parent/:year/add", async (req, res) => {
    const feiertage = await prisma.feiertag.findMany({});
  res.render("feiertage_verwaltung", {
    parent: req.params.parent,
    feiertage: feiertage,
    addTeam: true,
    params: req.params,
  });
});

router.get("/:parent/:year/delete/:id", async (req, res) => {
  await prisma.feiertag.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.redirect("/feiertage_verwaltung/" + req.params.parent + "/" + req.params.year);
});

router.post("/:parent/:year", async (req, res) => {
  const feiertage = await prisma.feiertag.findMany({});
  if (feiertage.length > 1) {
    for (let i = 0; i < feiertage.length; i++) {
      await prisma.feiertag.update({
        where: {
          id: feiertage[i].id,
        },
        data: {
          von: req.body.feiertagVon[i] + "T00:00:00.000Z",
          bis: req.body.feiertagBis[i] + "T00:00:00.000Z",
        }
      });
    }
  }
  else if(feiertage.length == 1){
    await prisma.feiertag.update({
      where: {
        id: feiertage[0].id,
      },
      data: {
        von: req.body.feiertagVon + "T00:00:00.000Z",
        bis: req.body.feiertagBis + "T00:00:00.000Z",
      }
    });
  }
  if(req.body.addFeiertagTitel){
    await prisma.feiertag.create({
      data: {
        titel: req.body.addFeiertagTitel,
        von: req.body.addFeiertagVon + "T00:00:00.000Z",
        bis: req.body.addFeiertagBis + "T00:00:00.000Z",
      }
    });
  }

  
  res.redirect("/feiertage_verwaltung/" + req.params.parent + "/" + req.params.year);
});

router.post("/:parent/:year/add", async (req, res) => {

  /*await prisma.feiertag.create({
        data: {
            titel:req.body.addFeiertagTitel,
            von: req.body.addFeiertagVon,
            bis: req.body.addFeiertagBis,
        }
    })*/
    res.redirect("/feiertage_verwaltung/" + req.params.parent + "/" + req.params.year +"/add");
});

export = router;
