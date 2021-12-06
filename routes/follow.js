const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    try{
        const [following_data, following_metadata] = await sequelize.query(`SELECT following FROM user, follow WHERE user_id=follower AND user_id='${global.id}'`);
        const [follower_data, follower_metadata] = await sequelize.query(`SELECT follower FROM user, follow WHERE user_id=following AND user_id='${global.id}'`);
        const [users, metadata] = await sequelize.query(`SELECT user_id FROM user WHERE user_id<>'${global.id}'`);
        let follow_list = [];
        let unfollow_list = [];
        for(i in users){
            let len = follow_list.length;
            let flag = true;
            for(j in following_data){
                if(users[i].user_id == following_data[j].following){
                    follow_list.push(users[i]);
                    flag = false;
                    break;
                }
            }
            if(len == follow_list.length && flag)
                unfollow_list.push(users[i]);
        }
        res.render('follow',{id : `${global.id}`, following : following_data, unfollowing : unfollow_list});
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;