import express from 'express';


let router = express.Router();

router.get('/', async (req, res) => {
    res.json(req.user);

});


export = router;