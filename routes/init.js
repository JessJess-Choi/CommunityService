const express = require('express');
const { ne } = require('sequelize/dist/lib/operators');
const router = express.Router();

router.get('/',(req,res,next) =>{
    res.render('init_screen');
});

router.get('/account',(req,res,next) =>{
    res.render('account');
});

module.exports = router;