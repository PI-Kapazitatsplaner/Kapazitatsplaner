import express from "express";
import prisma from "../prisma/client";
import sendFileIfParamEqualsName from '../middleware/fileSender/fileSender';

let router = express.Router();
var currentTime = new Date();


router.get("/:year/:pi", sendFileIfParamEqualsName, async (req, res) => {
  const header = { currSite: 1, username: req.user.name };
  if (
    parseInt(req.params.year) >= 2020 &&
    parseInt(req.params.year) <= 2100 &&
    (req.params.pi == "PI-01" ||
      req.params.pi == "PI-02" ||
      req.params.pi == "PI-03" ||
      req.params.pi == "PI-04")
  ) {
    res.render("team_kalender", {
      header,
      prefersWhiteMode: req.user.prefersWhiteMode,
      params: req.params,
    });
  }else {
    res.redirect(
      "/team_kalender/" + currentTime.getFullYear() + "/PI-01"
    );
  }
});

export = router;
