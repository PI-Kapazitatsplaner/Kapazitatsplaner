import express from 'express';

import prisma from '../Prisma/client';

let router = express.Router();

router.get('/', async (req, res) => {
    res.json(await prisma.user.findMany({}));
});


export = router;