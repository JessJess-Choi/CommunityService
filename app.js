const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');
const passport = require('passport');
const {sequelize} = require('./models');

dotenv.config();
const app = express();
const initPage = require('./routes/init');
const accountPage = require('./routes/account');

app.set('port',process.env.PORT || 8052);
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
});
sequelize.sync({force: false})
    .then(() => {
        console.log('db 연결 성공');
    })
    .catch((err) => {
        console.log(err);
    });

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
/*app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));*/
app.use(passport.initialize());
//app.use(passport.session());

app.use('/',initPage);
app.use('/account',accountPage);

app.listen(app.get('port'),() =>{
    console.log(app.get('port'));
});


app.use((req,res,next) =>{
    const error = new Error(`${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});
app.use((err,req,res,next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});