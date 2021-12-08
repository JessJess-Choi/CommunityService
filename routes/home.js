const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    res.render('home');
});

router.post('/', async (req,res,next) => {
    try{
        const {check, search} = req.body;
        if(check == 'hashtag'){
            const [result, metadata] = await sequelize.query(`SELECT * FROM post NATURAL JOIN photo NATURAL JOIN hashtag WHERE tag LIKE '%${search}%';`);
            console.log(result);
        }
        else if(check == 'text'){               //태그는 따로 검색해서 넣을것
            const [result, metadata] = await sequelize.query(`SELECT * FROM post NATURAL JOIN photo WHERE content LIKE '%${search}%';`);
            const [result_tag, meta] = await sequelize.query(`SELECT tag FROM hashtag NATURAL JOIN post NATURAL JOIN photo WHERE content LIKE '%${search}%';`);
            console.log(result);
            console.log(result_tag);
        }
        else if(check == 'writer'){
            const [result, metadata] = await sequelize.query(`SELECT * FROM user NATURAL JOIN post NATURAL JOIN photo WHERE user_name LIKE '%${search}%';`);
            console.log(result);
        }
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;