import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: "100", 
        standardAbwesenheiten:  req.user.standardAbwesenheiten.length === 0 ? [6, 0] : req.user.standardAbwesenheiten 
    });
});


export = router;