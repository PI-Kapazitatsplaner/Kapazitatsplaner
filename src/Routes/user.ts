import { AbwesenheitsTyp } from '@prisma/client';
import express from 'express';
import path from 'path';
import prisma from '../prisma/client';

let router = express.Router();

router.get('/:year?/:month?', async (req, res) => {
    const year = req.params.year;
    const month = req.params.month;
    if (year?.match(/^.*.js|.*.css$/)) {
        res.sendFile(path.join(__dirname, '../Public', year));
    } else if (month?.match(/^.*.js|.*.css$/)) {
        res.sendFile(path.join(__dirname, '../Public', month));
    } else {
        if (validateParams(req.params)) {           
            const abwesenheitenInMonth = await getAbwesenheitenInMonth(Number(year), Number(month), req.user.sub)
            const date = new Date(Number(year), Number(month) - 1, new Date().getDate());
            const calendar = {
                fillerDays: new Date(date.getFullYear(), date.getMonth(), 0).getDay(),
                daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                activeDay: !(Number(year) === new Date().getFullYear() && Number(month) === new Date().getMonth() + 1) ? 0 : date.getDate(),
                monthString: date.toLocaleString("de-CH", { month: "long" }),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
                abwesenheitenInMonth: abwesenheitenInMonth || [],
                standardAbwesenheiten: req.user.standardAbwesenheiten.length === 0 ? [6, 0] : req.user.standardAbwesenheiten
            }
            const header = { currSite: 2, username: req.user.name };
            res.render("mein_kalender", { header, prefersWhiteMode: req.user.prefersWhiteMode, calendar });
        }
        else {
            if (year !== undefined && Number(year) >= 2020 && Number(year) < 2100) {
                res.redirect('/mein_kalender/' + year + "/" + 1)
            } else {
                res.redirect('/mein_kalender/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1))
            }
        }
    }
});

router.post('/:year/:month', async (req, res) => {
    if (validateParams(req.params) && validateBody(req.body)) {
        swtichAbwesenheitsType(req.body.newState, Number(req.params.year), Number(req.params.month), Number(req.body.day), req.user.sub)
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
    return ((body.day !== undefined && Number(body.day) >= 1 && Number(body.day) < 32)
        && (body.newState === 'anwesend' || body.newState === 'abwesend' || body.newState === 'halbAbwesend'))
}

async function getAbwesenheitenInMonth(year: number, month: number, userSub: string): Promise<void | { date: any, typ: AbwesenheitsTyp }[]> {
    try {
        const abwesenheiten = await prisma.abwesenheit.findMany({
            where: {
                userSub: userSub,
                AND: {
                    date: {
                        gte: new Date(year + "-" + month + "-" + "01"),
                        lt: new Date((month >= 12 ? 0 : year) + "-" + (month >= 12 ? 1 : (month + 1)) + "-" + "1")
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

async function swtichAbwesenheitsType(newState: string, year: number, month: number, day: number, userSub: string): Promise<any> {
    const fillerDays = new Date(Number(year), Number(month) - 1, 0).getDay()
    if (newState === 'anwesend' && !((day + fillerDays) % 7 === 0 || (day + fillerDays + 1) % 7 === 0)) {
        try {
            return await prisma.abwesenheit.delete({
                where: {
                    userSub_date: {
                        userSub: userSub,
                        date: new Date(Number(year), Number(month) - 1, day)
                    }
                }
            });
        } catch (err) {
            console.log(err);
            return;
        }
    } else {
        try {
            return await prisma.abwesenheit.upsert({
                where: {
                    userSub_date: {
                        userSub: userSub,
                        date: new Date(Number(year), Number(month) - 1, day)
                    }
                },
                update: {
                    typ: <keyof typeof AbwesenheitsTyp>newState
                },
                create: {
                    userSub: userSub,
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
}


export = router;