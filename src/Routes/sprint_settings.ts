import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    res.render("sprint_verwaltung");
});


export = router;