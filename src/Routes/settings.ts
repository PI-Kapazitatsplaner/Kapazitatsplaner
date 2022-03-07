import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    let parent = 2;
    if (req.headers.referer?.includes("team_kalender")){ parent = 2; }
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: "100", 
        standardAbwesenheiten:  req.user.standardAbwesenheiten.length === 0 ? [6, 0] : req.user.standardAbwesenheiten,
        parent
    });
});


export = router;