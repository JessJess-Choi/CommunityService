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
        const dm_name = JSON.stringify(req.body).split(':')[1].split('}')[0].split(`"`)[1];
        const dm_log = await sequelize.query(`SELECT * FROM message WHERE (sender_id='${global.id}' AND receiver_id='${dm_name}') OR (sender_id='${dm_name}' AND receiver_id='${global.id}');`);
        console.log(dm_log[0]);
        if(dm_log[0][0].sender_id == global.id)
            global.receiver = dm_log[0][0].receiver_id;
        else
            global.receiver = dm_log[0][0].sender_id;
        dm_log.sort((a,b) => {
            return a.send_time - b.send_time;
        });
        res.render('msg',{flag : true, log : dm_log[0], id : global.id});
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

router.post('/store', async (req,res,next) => {
    try{
        const message = req.body.message;
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        await sequelize.query(`INSERT INTO message VALUES ('${global.id}','${global.receiver}','${date}','${message}')`);
        res.redirect('/msg');
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;