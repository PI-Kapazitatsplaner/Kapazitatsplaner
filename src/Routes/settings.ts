import express from 'express';

let router = express.Router();

router.get('/:pi', async (req, res) => {
    console.log(req.params.pi);
    
    res.render("settings");
});


export = router;