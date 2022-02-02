import express from 'express';

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = await ejs.renderFile("C:/Users/Gian Federspiel/Documents/GitHub/Kapazitatsplaner/Views/header.ejs", {currSite:2});
    res.render("mein_kalender", {header:header});
});


export = router;