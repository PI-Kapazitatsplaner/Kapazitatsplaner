import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    const now = new Date();
    const header = { currSite: 2, username: req.user.name };
    const calendar = {
        fillerDays: now.getDay(),
        daysInMonth: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(),
        activeDay: now.getDate(),
        month: now.toLocaleString("en-US", { month: "long" }),
        year: now.getFullYear(),
    }
    res.render("mein_kalender", { header, prefersWhiteMode: req.user.prefersWhiteMode, calendar });
});


export = router;
