const express = require('express');
const { model } = require('mongoose');
const router = express.Router();

router.get('/', (req, res)=>{
    obj={
        title: "first title",
        desc: "first description"
    }
    res.json(obj);
})

module.exports = router;