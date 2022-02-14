import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = { currSite: 2, username: req.user.name };
    res.render("team_kalender", { header, prefersWhiteMode: req.user.prefersWhiteMode });
});


export = router;