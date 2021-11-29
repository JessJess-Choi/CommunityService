const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/',(req,res,next) =>{
    res.render('init_screen');
});

router.get('/account',(req,res,next) =>{
    res.render('account');
});

router.get('/home',(req,res,next) =>{
    res.render('home');
});

router.post('/', async (req,res,next) => {
    const {id,password} = req.body;
    console.log('로그인 요청 >> id : ' + id + ' pw : ' + password);
    try{
        const [result, metadata] = await sequelize.query(`SELECT * FROM user WHERE user_id='${id}' AND user_password='${password}';`);
        console.log(result);
        if(result.length){
            res.send("<script>location.href='home'</script>");
        }
        else{
            res.send("<script>alert('wrong id or password');history.back();</script>");
        }
    } catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;