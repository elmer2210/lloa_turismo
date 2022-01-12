//Crud Urls
const express = require('express');
const router = express.Router();
const pool = require('../database')

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

//routes 

router.get('/', isNotLoggedIn,async (req, res)=>{
    const blogs = await pool.query('SELECT * FROM blog ORDER BY `create_at` DESC');
    res.render('blog/index', {blogs});
})

router.get('/add', isLoggedIn ,(req, res)=>{
    res.render('blog/create')
});

router.post('/add', isLoggedIn, async(req, res)=>{
    const {title, resumen, text, image} = req.body;
    const newBlog = {
        title,
        resumen,
        text,
        image:req.file.filename,
        create_for:req.user.id
    };
    await pool.query('INSERT INTO blog set ?', [newBlog])
    req.flash('success', 'Blog creado satisfactoriamente');
    res.redirect('/blog')
})

router.get('/show/:id', isLoggedIn, async(req, res)=>{
    const blog = await pool.query('SELECT * FROM blog WHERE create_for =? ORDER BY `create_at` DESC', [req.user.id]);
    res.render('blog/show', {blog})
})

module.exports = router;