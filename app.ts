import express from 'express';
import createError from 'http-errors';
import path from 'path';

import indexRouter from "./routes/index";

const app: express.Application = express();
const port: number = 3000;

//Use ejs as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'Public')));

app.use('/', indexRouter);

app.use(function(req, res, next) {
    next(createError(404));
});
  
// error handler
app.use(function(err:any, req:any, res:any, next:any) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
 
// Server setup
app.listen(port, () => {
    console.log(`App listening on: http://localhost:${port}/`);
});
