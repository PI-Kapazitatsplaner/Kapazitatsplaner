import express from 'express';

import path from "path";

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = await ejs.renderFile(path.join(__dirname, '../Views/header.ejs'), {currSite:1});
    res.render("team_kalender", {header:header});
});


export = router;