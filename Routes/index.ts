import express from 'express';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

let router = express.Router();

router.get('/', async (req, res) => {
    await prisma.user.create({ data: { email: 'test' } })
    res.json(await prisma.user.findMany({}));
});


export = router;