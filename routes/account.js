const express = require('express');
const { sequelize } = require('../models');
const router = express.Router();

const crypto = require('crypto');
const { defaultCipherList } = require('constants');
const algorithm = 'aes-256-cbc';
const key = 'abcdefghijklmnopqrstuvwxyz123456';
const iv = '1234567890123456';
const cipher = crypto.createCipheriv(algorithm,key,iv);

router.post('/', async (req,res,next) => {
    const {email,name,id,password} = req.body;
    console.log('name : ' + name + ' id : ' + id + ' pw : ' + password + ' email : ' + email);
    try{
        const [result_id, metadata_id] = await sequelize.query(`SELECT * FROM user WHERE user_id='${id}';`);
        const [result_email, metadata_email] = await sequelize.query(`SELECT * FROM user WHERE user_email='${email}';`);
        if(result_id.length){
            res.send("<script>alert('아이디가 중복됩니다. 다른 아이디를 사용해 주세요');history.back();</script>");
        }
        else if(result_email.length){
            res.send("<script>alert('이메일이 중복됩니다. 다른 이메일을 사용해 주세요');history.back();</script>");
        }
        else{
            let encrypt_password = cipher.update(password,'utf-8','base64');
            encrypt_password += cipher.final('base64');
            await sequelize.query(`INSERT INTO user VALUES ('${id}','${email}','${name}','${encrypt_password}');`);
            res.send("<script>alert('회원가입 완료. 로그인을 진행하여 주세요.');location.href='/'</script>");
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;

/*
CREATE TABLE user(
	user_id VARCHAR(32),
    user_email VARCHAR(32),
    user_name VARCHAR(32),
    user_password VARCHAR(128),
    PRIMARY KEY (user_id)
);
*/