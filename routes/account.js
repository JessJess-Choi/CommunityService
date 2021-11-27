const express = require('express');
const router = express.Router();

router.post('/',(req,res,next) => {
    const {email,name,id,password} = req.body;
    console.log(name + " : " + id);
});

module.exports = router;