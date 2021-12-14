const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    try{
        if(global.redirect_data){
            res.render('home',{data : global.redirect_data});
            global.redirect_data = undefined;
        }
        else{
            const [result, metadata] = await sequelize.query(`SELECT user_name, post_date, content, post_id FROM user NATURAL JOIN post;`);
            const [photo_result, meta_photo] = await sequelize.query(`SELECT photo FROM post NATURAL JOIN photo;`);
            res.render('home',{data : result, photo : photo_result});
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

router.post('/', async (req,res,next) => {              //post_id 만 알면 모든 정보를 알 수 있다.
    try{
        let result, metadata;
        let result_tag, meta;
        const {check, search} = req.body;
        if(check == 'hashtag'){
            [result, metadata] = await sequelize.query(`SELECT * FROM user NATURAL JOIN post NATURAL JOIN photo NATURAL JOIN hashtag WHERE tag LIKE '%${search}%';`);
            global.redirect_data = result;
        }
        else if(check == 'text'){               
            [result, metadata] = await sequelize.query(`SELECT post_id, user_name, user_id, content, post_date FROM user NATURAL JOIN post WHERE content LIKE '%${search}%';`);
            global.redirect_data = result;
        }
        else if(check == 'writer'){
            [result, metadata] = await sequelize.query(`SELECT * FROM user NATURAL JOIN post NATURAL JOIN photo WHERE user_name LIKE '%${search}%';`);
            global.redirect_data = result;
        }
        res.redirect('/home');
        console.log(result);
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;