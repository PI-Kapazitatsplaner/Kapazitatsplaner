import { log } from 'console';
import express from 'express';
import prisma from '../prisma/client';


let router = express.Router();

router.get('/', async (req, res) => {  
    let parent = 1;
    if (req.headers.referer?.includes("team_kalender")){ parent = 2; }       
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: req.user.productivityPercentage, 
        standardAbwesenheiten:  req.user.standardAbwesenheiten,
        csrfToken: req.csrfToken(),
        parent
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
        let prefersWhiteMode;
        if(req.body.theme === "light") {
            prefersWhiteMode = true;
        } else if (req.body.theme === "dark") {
            prefersWhiteMode = false;
        }
        await prisma.user.update({
            where: {
                sub: req.user.sub
            },
            data: {
                standardAbwesenheiten: standardAbwesenheiten,
                productivityPercentage: parseInt(req.body.productivity),
                preferencesWhiteMode: prefersWhiteMode
            }
        });
        res.redirect('/settings');
    }else{
        res.status(500).send('Error while Parsing data');
    }
});


export = router;