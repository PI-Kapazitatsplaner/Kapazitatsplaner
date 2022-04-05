import { log } from 'console';
import express from 'express';
import prisma from '../prisma/client';


let router = express.Router();

router.get('/', async (req, res) => {   
    
    let userTeams = [];
    let userTeamPercentage = []
    if(req.user.sub){
        const user_team = await prisma.user_Team.findMany({
            where:{
                userSub: req.user.sub
            }
        })
        for(let i = 0; i < user_team.length; i++){
            let usersTeam = await prisma.team.findUnique({
                where:{
                    id: user_team[i].teamId
                }
            })
            userTeamPercentage.push(user_team[i].productivityPercentage)  
            userTeams.push(usersTeam);
        }
    }  
    
    let parent = 1;
    if (req.headers.referer?.includes("team_kalender")){ parent = 2; }       
    res.render("settings", { 
        prefersWhiteMode: req.user.prefersWhiteMode, 
        productivity: userTeamPercentage, 
        standardAbwesenheiten:  req.user.standardAbwesenheiten,
        csrfToken: req.csrfToken(),
        teams: userTeams,
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
                preferencesWhiteMode: prefersWhiteMode
            }
        });
        const user_teams = await prisma.user_Team.findMany({
            where:{
                userSub: req.user.sub
            }
        })    

        for (let i = 0; i < user_teams.length; i++) { 
            await prisma.user_Team.update({
                where:{
                    user_teamKey:{
                        teamId: user_teams[i].teamId,
                        userSub: req.user.sub
                    }
                },
                data:{
                    productivityPercentage: Number(req.body.productivity[i])
                }
            })
        }

        res.redirect('/settings');
    }else{
        res.status(500).send('Error while Parsing data');
    }
});


export = router;