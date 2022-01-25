import express from 'express';

let router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello Test!');
});


export = router ;