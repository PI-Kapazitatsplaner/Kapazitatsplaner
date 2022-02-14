import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    res.redirect('/team_kalender');
});



export = router;