const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
//const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');
const passport = require('passport');

dotenv.config();
const app = express();
const initPage = require('./routes/init');


app.set('port',process.env.PORT || 8052);
app.set('view engine','html');
nunjucks.configure('views',{
    express: app,
    watch: true,
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

app.listen(app.get('port'),() =>{
    console.log(app.get('port'));
})