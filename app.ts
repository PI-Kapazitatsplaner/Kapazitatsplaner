import express from 'express';
import createError from 'http-errors';
import path from 'path';
import bodyParser from 'body-parser';
import indexRouter from "./Routes/index";

const app = express();
const port: number = Number(process.env.PORT) || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Use ejs as view engine
app.set('views', path.join(__dirname, 'Views'));
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
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`App listening on: http://localhost:${port}/`);
    });
}

// Export the app for testing
export default app;
