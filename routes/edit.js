const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.post('/',(req,res,next) => {
     global.post_id = JSON.stringify(req.body).split(':')[0].split('"')[1]
     console.log(post_id);
     console.log(req.body);
     res.render('edit');
});

router.post('/edit_or_delete', async (req,res,next) => {
     console.log(req.body);
     console.log(global.post_id);       //post id
     try{
          await sequelize.query(`DELETE FROM photo WHERE post_id='${global.post_id}'`);
          await sequelize.query(`DELETE FROM hashtag WHERE post_id='${global.post_id}';`);
          await sequelize.query(`DELETE FROM post WHERE post_id='${global.post_id}';`);
          if(req.body.edit_or_delete == '게시'){            //수정하는 쿼리
               const [tmp_photo, photo_meta] = await sequelize.query(`SELECT max(photo_id) AS photo FROM photo;`);
               let photo1, photo2, photo3, photo4, photo5, content, post_number, photo_number, content_number, flag;
               const today = new Date();
               const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
               content = req.body.content;
               flag = true;
               post_number = global.post_id;
               photo_number = tmp_photo.photo_id;

               if(req.body.photo1.length != 0){
                    photo1 = req.body.photo1;
                    await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}','${date}');`);
                    await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo1}');`);
                    photo_number++;
                    flag = false;
                }
                if(req.body.photo2.length != 0){
                    photo2 = req.body.photo1;
                    if(flag)
                        await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}','${date}');`);
                    await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo2}');`);
                    photo_number++;
                    flag = false;
                }
                if(req.body.photo3.length != 0){
                    photo3 = req.body.photo3;
                    if(flag)
                        await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}','${date}');`);
                    await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo3}');`);
                    photo_number++;
                    flag = false;
                }
                if(req.body.photo4.length != 0){
                    photo4 = req.body.photo4;
                    if(flag)
                        await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}','${date}');`);
                    await sequelize.query(`INSERT INTO photo VALUES ('${photo_number}','${post_number}','${photo4}');`);
                    photo_number++;
                    flag = false;
                }
                if(req.body.photo5.length != 0){
                    photo5 = req.body.photo5;
                    if(flag)
                        await sequelize.query(`INSERT INTO post VALUES ('${post_number}','${global.id}','${content}','${date}');`);
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
          }
          else if(req.body.edit_or_delete == '삭제'){           //삭제 쿼리
               console.log('삭제 : ' + global.post_id);
          }
          res.redirect('/home');
     }
     catch(err){
          console.log(err);
          next(err);
     }
});

module.exports = router;