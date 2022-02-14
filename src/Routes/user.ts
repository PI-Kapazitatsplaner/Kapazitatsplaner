import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = { currSite: 2, username: req.user.name };
    const calendar = {
        fillerDays: 1,
        daysInMonth: 31,
        activeDay: 3,
    }
    res.render("mein_kalender", { header, prefersWhiteMode: req.user.prefersWhiteMode, calendar });
});


export = router;