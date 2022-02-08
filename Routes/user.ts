import express from 'express';

import path from "path";

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    const header = await ejs.renderFile(path.join(__dirname, '../Views/header.ejs'), {currSite:2});
    res.render("mein_kalender", {header:header});
});


export = router;