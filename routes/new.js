const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/',(req,res,next) => {
    res.render('new');
});

router.post('/', async (req,res,next) => {
    try{
        let photo1, photo2, photo3, photo4, photo5, content, post_number, photo_number, content_number, flag;
        content = req.body.content;
        flag = true;
        const [tmp, tmp_meta] = await sequelize.query(`SELECT count(post_id) AS post FROM post;`);
        const [tmp_photo, photo_meta] = await sequelize.query(`SELECT count(photo_id) AS photo FROM photo;`);
        post_number = tmp[0].post + 1;
        photo_number = tmp_photo[0].photo + 1;

        if(req.body.photo1.length != 0){
            photo1 = req.body.photo1;
            await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}');`);
            await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo1}');`);
            photo_number++;
            flag = false;
        }
        if(req.body.photo2.length != 0){
            photo2 = req.body.photo1;
            if(flag)
                await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}');`);
            await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo2}');`);
            photo_number++;
            flag = false;
        }
        if(req.body.photo3.length != 0){
            photo3 = req.body.photo3;
            if(flag)
                await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}');`);
            await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo3}');`);
            photo_number++;
            flag = false;
        }
        if(req.body.photo4.length != 0){
            photo4 = req.body.photo4;
            if(flag)
                await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}');`);
            await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo4}');`);
            photo_number++;
            flag = false;
        }
        if(req.body.photo5.length != 0){
            photo5 = req.body.photo5;
            if(flag)
                await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}');`);
            await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo5}');`);
            photo_number++;
            flag = false;
        }

        let hashtag = content.split('#');
        let hashtag_list = [];
        for(i in hashtag){
            if(hashtag[i].length != 0){
                let tmp = hashtag[i].split(' ');
                hashtag_list.push(tmp[0]);
            }
        }
        for(i in hashtag_list){
            await sequelize.query(`INSERT INTO hashtag VALUES ('${hashtag_list[i]}','${post_number}');`);
        }
        
        res.redirect('/home');
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;