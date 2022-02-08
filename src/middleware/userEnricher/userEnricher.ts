import express from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function enrichUser(req: express.Request, res: express.Response, next: express.NextFunction) {
    let content;
    if (process.env.NODE_ENV === 'test') {
        console.log('Mocking Userenricher');
        content = {
            sub: 'c2842822-67f5-4759-8db8-a431ddfc3500',
            name: 'mock',
            preferred_username: 'mtm',
            given_name: 'test',
            family_name: 'mock',
            email: 'test@mock.ch',
        }
    } else {
        if (req.kauth.grant === undefined) {
            res.status(500).send('Error in Keycloak middleware');
        }
        content = req.kauth.grant.access_token.content;
    }

    const user = await prisma.user.findUnique({ where: { sub: content.sub } })
        || await prisma.user.create({ data: { sub: content.sub } });

    req.user = {
        sub: content.sub,
        name: content.name,
        preferred_username: content.preferred_username,
        given_name: content.given_name,
        family_name: content.family_name,
        email: content.email,
        preferencesWhiteMode: user.preferencesWhiteMode,
    }

    next();
};