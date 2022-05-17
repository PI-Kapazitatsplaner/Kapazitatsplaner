import prisma from "../prisma/client";
import express from "express";

let router = express.Router();

router.get("/:parent", async (req, res) => {
  const feiertage = await prisma.feiertag.findMany({});
  res.render("feiertage_verwaltung", {
    parent: req.params.parent,
    feiertage: feiertage,
    addTeam: false,
  });
});

router.get("/:parent/add", async (req, res) => {
  const feiertage = await prisma.feiertag.findMany({});
  res.render("feiertage_verwaltung", {
    parent: req.params.parent,
    feiertage: feiertage,
    addTeam: true,
  });
});

router.get("/:parent/delete/:id", async (req, res) => {
  await prisma.feiertag.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.redirect("/" + req.params.parent);
});

router.post("/:parent/add", async (req, res) => {
    console.log("here")
    await prisma.feiertag.create({
        data: {
            titel:req.body.addFeiertagTitel,
            von: req.body.addFeiertagVon,
            bis: req.body.addFeiertagBis,
        }
    })
    res.redirect("/" + req.params.parent);
});

export = router;
