const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    try{
        const [following_data, following_metadata] = await sequelize.query(`SELECT following FROM user, follow WHERE user_id=follower AND user_id='${global.id}'`);
        const [follower_data, follower_metadata] = await sequelize.query(`SELECT follower FROM user, follow WHERE user_id=following AND user_id='${global.id}'`);
        const [users, metadata] = await sequelize.query(`SELECT user_id, user_name FROM user WHERE user_id<>'${global.id}'`);
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
        res.render('follow',{id : `${global.id}`, following : follow_list, unfollowing : unfollow_list});
    }
    catch(err){
        console.log(err);
        next(err);
    }
});
 
router.post('/', async (req,res,next) => {
    try{
        const [result, metadata] = await sequelize.query(`SELECT following FROM follow WHERE follower='${global.id}';`);
        const store = req.body;
        for(i in store){
            if(store[i] == 'unfollow'){                                             //언팔로우 요청
                if(check = () => {                                                  //팔로우 중 인 경우
                    for(j in result){
                        if(result[j] == i)return true;
                    }
                    return false;
                }){
                    console.log(i + ' ' + store[i] + ' ' + global.id);
                    await sequelize.query(`DELETE FROM follow WHERE following='${i}' AND follower='${global.id}';`);
                }
            }
            else{                                                                       //팔로우 요청
                if(check = () => {                                                      //팔로우 중이 아닌 경우
                    for(j in result){
                        if(result[j] == i)return false;
                    }
                    return true;
                }){
                    console.log(i + ' ' + store[i] + ' ' + global.id);
                    const [tmp, tmp_meta] = await sequelize.query(`SELECT * FROM follow WHERE follower='${global.id}' AND following='${i}'`);
                    if(tmp.length == 0)                                                 //db에 삽입할 값이 없는 경우
                        await sequelize.query(`INSERT INTO follow VALUES('${global.id}','${i}');`);
                }
                else;
            }
        }
        res.redirect('/follow');
    }
    catch(err){
        console.log(err);
        next(err);
    }
});

module.exports = router;