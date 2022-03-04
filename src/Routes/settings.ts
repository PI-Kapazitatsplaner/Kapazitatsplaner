import express from 'express';
import prisma from '../prisma/client';


let router = express.Router();

router.get('/', async (req, res) => {    
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: req.user.productivityPercentage, 
        standardAbwesenheiten:  req.user.standardAbwesenheiten,
        csrfToken: req.csrfToken()
    });
});

router.post('/', async (req, res) => {
    if(req.body.productivity !== undefined) {
        let standardAbwesenheiten;
        if(req.body.standardAbwesenheiten === undefined) {
            standardAbwesenheiten = [];
        }else if(typeof req.body.standardAbwesenheiten === "string") {
            standardAbwesenheiten = parseInt(req.body.standardAbwesenheiten)
        }else {
            standardAbwesenheiten = req.body.standardAbwesenheiten.map((el:string)=>parseInt(el));
        }
        await prisma.user.update({
            where: {
                sub: req.user.sub
            },
            data: {
                standardAbwesenheiten: standardAbwesenheiten,
                productivityPercentage: parseInt(req.body.productivity),
            }
        });
        res.redirect('/settings');
    }else{
        res.status(500).send('Error while Parsing data');
    }
});


export = router;