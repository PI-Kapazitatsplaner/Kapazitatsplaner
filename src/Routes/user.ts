import express from 'express';
import path from 'path';
import { param } from '.';
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
            const date = new Date(Number(year), Number(month) - 1, new Date().getDate());
            const calendar = {
                fillerDays: new Date(date.getFullYear(), date.getMonth(), 0).getDay(),
                daysInMonth: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
                activeDay: !(Number(year) === new Date().getFullYear() && Number(month) === new Date().getMonth() + 1) ? 0 : date.getDate(),
                monthString: date.toLocaleString("de-CH", { month: "long" }),
                month: date.getMonth() + 1,
                year: date.getFullYear(),
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
    if (validateParams(req.params)) {
        await prisma.abwesenheit.create({
            data: {
                    user:{
                        connect:{ sub: req.user.sub }
                    },
                    date: new Date(Number(req.params.year), Number(req.params.month), req.body.day)
                }
        });
    } else {
        res.send(400);
    }
});

function validateParams(params: any): Boolean {
    return (!(params.year === undefined || params.month === undefined)
        && Number(params.year) >= 2020 && Number(params.year) < 2100
        && Number(params.month) >= 1 && Number(params.month) <= 12)
}

function validateBody(body: any): Boolean {
    return (body.day !== undefined && Number(body.day) >= 1 && Number(body.day) < 32)
}

export = router;