const express = require('express');
const router = express.Router();
const { USER } = require('sequelize/dist/lib/query-types');
const { sequelize } = require('../models');

router.get('/', async (req,res,next) => {
    res.render('home');
});

module.exports = router;