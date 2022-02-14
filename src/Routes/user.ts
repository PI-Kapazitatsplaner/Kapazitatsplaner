import express from 'express';

import path from "path";

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = await ejs.renderFile(path.join(__dirname, '../Views/header.ejs'), { currSite: 2, username: req.user.name });
    let calendar:any = {
        fillerDays: 5,
        daysInMonth: 31,
        activeDay: 1,
    }
    res.render("mein_kalender", { header: header, prefersWhiteMode: req.user.prefersWhiteMode, calendar });
});


export = router;