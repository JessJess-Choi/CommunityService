const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    try{
        const [F4F, F4F_meta] = await sequelize.query(`SELECT A.following FROM follow AS A, follow AS B WHERE A.follower=B.following AND B.follower=A.following AND A.follower='${global.id}';`);
        console.log(F4F);
        res.render('msg',{dm_list : F4F});
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

router.post('/', async (req,res,next) => {
    try{
        
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;