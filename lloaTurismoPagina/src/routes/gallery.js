//Crud Urls
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const pool = require('../database')
const path = require('path');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

//routes get

router.get('/', isNotLoggedIn, async(req, res)=>{
    const photos = await pool.query('SELECT * FROM gallery ORDER BY create_at DESC');
    res.render('gallery/index', {photos});
});

router.get('/show', isLoggedIn, async(req, res)=>{
    const {id} = req.user;
    const photos = await pool.query('SELECT * FROM gallery WHERE create_for = ? ORDER BY create_at DESC', [id]);
    res.render('gallery/show', {photos})
})

//routes post

module.exports = router;