import express from 'express';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

let router = express.Router();

router.get('/', async (req, res) => {
    res.json(await prisma.user.findMany({}));
});


export = router;