import express, { query } from 'express';
import path from 'path'

import { PrismaClient } from '@prisma/client'
import { parse } from 'path/posix';
const prisma = new PrismaClient()

let router = express.Router();
var currentTime = new Date();

router.get('/:year/:pi', async (req, res) => {
    if (req.params.pi?.match(/^.*.js|.*.css$/)) {
        res.sendFile(path.join(__dirname, '../Public', req.params.pi));
    }
    else{
        if( parseInt(req.params.year) >= 2020 && 
            parseInt(req.params.year) <= 2100 &&(
            req.params.pi == "PI-01" ||
            req.params.pi == "PI-02" ||
            req.params.pi == "PI-03" ||
            req.params.pi == "PI-04")
          ){
            res.render("sprint_verwaltung", {params : req.params});
        }
        else{
            res.redirect("/sprint_verwaltung/" + currentTime.getFullYear() + "/PI-01");
            console.log("Page not Found");
        }        
    }    
});
// router.post('/:year/:pi', async (req, res) => {
//    const pi = prisma.pi.findFirst({where: {
//        year: req.params.year,
//        AND:{
//            iteration: req.params.pi
//        }
//    }})


//    res.render("sprint_verwaltung", {params : req.params});
//});

export = router;