import express from 'express';

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = await ejs.renderFile("C:/Users/Gian Federspiel/Documents/GitHub/Kapazitatsplaner/Views/header.ejs", {currSite:1});
    res.render("team_kalender", {header:header});
});


export = router;