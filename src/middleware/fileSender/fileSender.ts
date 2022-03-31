import path from 'path';
import fs from 'fs';
import express from 'express'

export default function sendFileIfParamEqualsName(req: express.Request, res: express.Response, next: express.NextFunction) {
    const files = fs.readdirSync(path.join(__dirname, '../../Public'));
    const file =    files.find(f => f.toLowerCase() === req.params.year?.toLowerCase()) || 
                    files.find(f => f.toLowerCase() === req.params.month?.toLowerCase()) || 
                    files.find(f => f.toLowerCase() === req.params.pi?.toLowerCase());
    if (file) {
        res.sendFile(path.join(__dirname, '../../Public', file));
    } else {
        next();
    }
};