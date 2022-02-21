import express from 'express';

import ejs from 'ejs';

let router = express.Router();

router.get('/', async (req, res) => {

            //Gibt Variable von referer Seite mit, um von Settings wieder zur Aufrufer-Seite zu gelangen
            if (req.headers.referer?.includes("team_kalender")){
                res.render("settings", { parent: 2 });
            }
            else{
                res.render("settings", { parent: 1 });
            }
            
            
        });


export = router;