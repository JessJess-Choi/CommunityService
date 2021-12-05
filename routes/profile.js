const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    const [following_data, following_metadata] = await sequelize.query(`SELECT count(following) AS count FROM follow WHERE follower='${global.id}'`);
    const [follower_data, follower_metadata] = await sequelize.query(`SELECT count(follower) AS count FROM follow WHERE following='${global.id}'`);
    res.render('profile',{id : `${global.id}`, email : `${global.email}`, name : `${global.name}`, now : new Date(), following : following_data[0].count, follower : follower_data[0].count});
});

module.exports = router;