import express from 'express';
import prisma from '../prisma/client';


let router = express.Router();

router.get('/', async (req, res) => {    
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: req.user.productivityPercentage, 
        standardAbwesenheiten:  req.user.standardAbwesenheiten,
    });
});

router.post('/', async (req, res) => {
    console.log(req.body);
    
    
    if(req.body.productivity !== undefined) {
        const u = await prisma.user.update({
            where: {
                sub: req.user.sub
            },
            data: {
                standardAbwesenheiten: req.body.standardAbwesenheiten.map((el:string)=>parseInt(el)) || [],
                productivityPercentage: parseInt(req.body.productivity),
            }
        });

        console.log(u);
        
        res.redirect('/settings');
    }else{
        res.status(500).send('Error while Parsing data');
    }
});


export = router;