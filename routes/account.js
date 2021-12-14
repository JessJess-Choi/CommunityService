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
        if(name.length < 1 || password.length < 1 || name.length < 1 || email.length < 7){
            res.send("<script>alert('양식이 올바르지 않습니다.');history.back();</script>");
        }
        else if(result_id.length){
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

CREATE TABLE follow(
    follower VARCHAR(32),
    following VARCHAR(32),
    PRIMARY KEY (follower, following),
    FOREIGN KEY (follower) REFERENCES user(user_id),
    FOREIGN KEY (following) REFERENCES user(user_id)
);

CREATE TABLE post(
    post_id VARCHAR(10),
    user_id VARCHAR(32),
    content VARCHAR(100),
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE photo(
    photo_id VARCHAR(10),
    post_id VARCHAR(64),
    photo MEDIUMBLOB,
    PRIMARY KEY (photo_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

CREATE TABLE hashtag(
    tag VARCHAR(32),
    post_id VARCHAR(64),
    PRIMARY KEY (tag,post_id),
    FOREIGN KEY (post_id) REFERENCES post(post_id)
);

CREATE TABLE message(
    sender_id VARCHAR(32),
    receiver_id VARCHAR(32),
    send_time DATETIME,
    dm_content VARCHAR(128),
    PRIMARY KEY (sender_id, receiver_id, send_time, dm_content),
    FOREIGN KEY (sender_id) REFERENCES user(user_id),
    FOREIGN KEY (receiver_id) REFERENCES user(user_id)
);

<ul>
    {% for i in following %}
    <li>
        {{loop.index}}번째 팔로우 하는 사람 :  {{i.following}}
    </li>
    {% endfor %}
</ul>
<ul>
    {% for j in follower %}
    <li>
        {{loop.index}}번째 팔로워 : {{j.follower}}
    </li>  
    {% endfor %}  
</ul>
*/