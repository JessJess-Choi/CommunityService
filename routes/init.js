const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = 'abcdefghijklmnopqrstuvwxyz123456';
const iv = '1234567890123456';

router.get('/',(req,res,next) => {
    res.render('init_screen');
});

router.get('/account',(req,res,next) => {
    res.render('account');
});

router.post('/', async (req,res,next) => {
    const {id,password} = req.body;
    console.log('로그인 요청 >> id : ' + id + ' pw : ' + password);
    try{
        const [result, metadata] = await sequelize.query(`SELECT * FROM user WHERE user_id='${id}';`);
        if(result.length){
            const decipher = crypto.createDecipheriv(algorithm,key,iv);
            let decrypt_password = decipher.update(result[0].user_password,'base64','utf-8');
            decrypt_password += decipher.final('utf8');
            if(decrypt_password == password){
                global.loginCheck = true;
                global.id = id;
                global.name = result[0].user_name;
                global.email = result[0].user_email;
                res.redirect('/home');
            }
            else
                res.send("<script>alert('wrong id or password');history.back();</script>");
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