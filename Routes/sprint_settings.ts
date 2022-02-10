import express from 'express';
import path from 'path'
import ejs from 'ejs';

let router = express.Router();

router.get('/:year/:pi', async (req, res) => {
    if (req.params.pi?.match(/^.*.js|.*.css$/)) {
        res.sendFile(path.join(__dirname, '../Public', req.params.pi));
    }
    else{
        res.render("sprint_verwaltung", {query : req.query, params : req.params});
    }    
});
export = router;