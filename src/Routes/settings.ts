import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    let parent = 2;
    if (req.headers.referer?.includes("team_kalender")){ parent = 2; }
    res.render("settings", { prefersWhiteMode: req.user.prefersWhiteMode, parent })
});


export = router;