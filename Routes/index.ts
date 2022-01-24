import express from 'express';

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

let router = express.Router();

router.get('/', async (req, res) => {
    res.json(prisma.users.findMany({}));
});


export = router;