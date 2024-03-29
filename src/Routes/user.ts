import { AbwesenheitsTyp, User } from '@prisma/client';
import express, { Request } from 'express';
import prisma from '../prisma/client';
import sendFileIfParamEqualsName from '../middleware/fileSender/fileSender';

let router = express.Router();

router.get('/:year?/:month?', sendFileIfParamEqualsName, async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    if (validateParams(req.params)) {
        const abwesenheitenInMonth = await getAbwesenheitenInMonth(Number(year), Number(month), req.user.sub)
        const date = new Date(Number(year), Number(month) - 1, 1);
        const calendar = {
            fillerDays: new Date(date.getFullYear(), date.getMonth(), 0).getDay(),
            daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
            activeDay: !(Number(year) === new Date().getFullYear() && Number(month) === new Date().getMonth() + 1) ? 0 : new Date().getDate(),
            monthString: date.toLocaleString("de-CH", { month: "long" }),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            abwesenheitenInMonth: abwesenheitenInMonth || [],
            standardAbwesenheiten: req.user.standardAbwesenheiten,
            feiertage: await getFeiertageInMonth(date, false),
            halbeFeiertage: await getFeiertageInMonth(date, true)
        } 
        const user = await prisma.user.findUnique({
            where:{
                sub: req.user.sub
            }
        });
        const header = { currSite: 2, username: req.user.name };
        res.render("mein_kalender", { 
            header, 
            prefersWhiteMode: req.user.prefersWhiteMode, 
            anzAbwesenheiten: req.user.standardAbwesenheiten.length ,
            calendar,
            role: user?.role, 
            csrfToken: req.csrfToken() });
    }
    else {
        if (year !== undefined && Number(year) >= 2020 && Number(year) < 2100) {
            res.redirect('/mein_kalender/' + year + "/" + 1)
        } else {
            res.redirect('/mein_kalender/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1))
        }
    }
});



router.post('/:year/:month', async (req, res) => {  
    if (validateParams(req.params) && validateBody(req.body)) {
        for (const day of req.body.newlyChangedAbwesenheiten) {            
             await swtichAbwesenheitsType(day.newState, Number(req.params.year), Number(req.params.month), Number(day.id), req)
    }
    } else {
        res.sendStatus(400);
    }
});

function validateParams(params: any): Boolean {
    return (!(params.year === undefined || params.month === undefined)
        && Number(params.year) >= 2020 && Number(params.year) < 2100
        && Number(params.month) >= 1 && Number(params.month) <= 12)
}

function validateBody(body: any): Boolean {
    return body.newlyChangedAbwesenheiten !== undefined && body.newlyChangedAbwesenheiten.length > 0
}

async function getAbwesenheitenInMonth(year: number, month: number, userSub: string): Promise<void | { date: any, typ: AbwesenheitsTyp }[]> {
    try {
        const abwesenheiten = await prisma.abwesenheit.findMany({
            where: {
                userSub: userSub,
                AND: {
                    date: {
                        gte: new Date(year + "-" + month + "-" + "01"),
                        lt: new Date((month >= 12 ? year + 1 : year) + "-" + (month >= 12 ? 1 : (month + 1)) + "-" + "1")
                    },
                }
            }
        });
        return abwesenheiten.map(abwesenheit => {
            return {
                date: abwesenheit.date.getDate(),
                typ: abwesenheit.typ
            };
        });
    } catch (err) {
        console.log(err);
        return [];
    }
}

async function swtichAbwesenheitsType(newState: string, year: number, month: number, day: number, req: Request): Promise<any> {    
    try {
        return await prisma.abwesenheit.upsert({
            where: {
                userSub_date: {
                    userSub: req.user.sub,
                    date: new Date(Number(year), Number(month) - 1, day)
                }
            },
            update: {
                typ: <keyof typeof AbwesenheitsTyp>newState
            },
            create: {
                userSub: req.user.sub,
                date: new Date(Number(year), Number(month) - 1, day),
                typ: <keyof typeof AbwesenheitsTyp>newState
            }
        });
    }
    catch (err) {
        console.log(err);
        return;
    }
}

async function getFeiertageInMonth(date: Date, halberTag: boolean): Promise<number[]> {
    return await prisma.feiertag.findMany({
        where: {   
            datum: {
                gte: new Date(date.getFullYear(), date.getMonth(), 1),
                lt: new Date(date.getFullYear(), date.getMonth() + 1, 0)
            },
            halberTag: halberTag
        }
    }).then(feiertage => {
        return feiertage.map(feiertag => {
            return feiertag.datum.getDate();
        });
    });
}

export = router;
