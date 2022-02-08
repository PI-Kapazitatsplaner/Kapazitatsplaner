import express from 'express';

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    res.render("settings");
});


export = router;