import express from 'express';

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {
    res.render("sprint_verwaltung", {query : req.query});
});


export = router;