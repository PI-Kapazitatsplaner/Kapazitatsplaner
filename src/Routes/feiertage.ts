import prisma from "../prisma/client";
import express from "express";

let router = express.Router();

router.get("/:parent/:year", async (req, res) => {
  if(req.user.role == "dev"){
    res.send("No Access")
  }
  else{
    const feiertage = await prisma.feiertag.findMany({
      where: {
        datum: {
          gte: new Date(req.params.year + "-01-01"),
          lte: new Date(req.params.year + "-12-31"),
        },
      }
    });
    res.render("feiertage_verwaltung", {
      prefersWhiteMode: req.user.prefersWhiteMode,
      parent: req.params.parent,
      feiertage: feiertage,
      addFeiertag: false,
      params: req.params,
    });
  }
  
});

router.get("/:parent/:year/add", async (req, res) => {
  if(req.user.role == "dev"){
    res.send("No Access")
  }
  else{
    const feiertage = await prisma.feiertag.findMany({
      where: {
        datum: {
          gte: new Date(req.params.year + "-01-01"),
          lte: new Date(req.params.year + "-12-31"),
        },
      }
    });
    res.render("feiertage_verwaltung", {
      prefersWhiteMode: req.user.prefersWhiteMode,
      parent: req.params.parent,
      feiertage: feiertage,
      addFeiertag: true,
      params: req.params,
    });
  }
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
          datum: req.body.feiertagDatum[i] + "T00:00:00.000Z",
          halberTag: req.body.halberTag instanceof Array ? req.body.halberTag.includes(feiertage[i].titel) : req.body.halberTag === feiertage[i].titel,
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
        datum: req.body.feiertagDatum + "T00:00:00.000Z",
        halberTag: req.body.halberTag instanceof Array ? req.body.halberTag.includes(feiertage[0].titel) : req.body.halberTag === feiertage[0].titel,
      }
    });
  }
  if(req.body.addFeiertagTitel){
    await prisma.feiertag.create({
      data: {
        titel: req.body.addFeiertagTitel,
        datum: req.body.addFeiertagDatum + "T00:00:00.000Z",
        halberTag: req.body.addHalberTag instanceof Array ? req.body.addHalberTag.includes("nameeinesfeiertagesdenniejemandverwendenwird") : req.body.addHalberTag === "nameeinesfeiertagesdenniejemandverwendenwird",
      }
    });
  }  
  res.redirect("/feiertage_verwaltung/" + req.params.parent + "/" + req.params.year);
});

router.post("/:parent/:year/add", async (req, res) => {
  res.redirect("/feiertage_verwaltung/" + req.params.parent + "/" + req.params.year + "/add");
})

export = router;
