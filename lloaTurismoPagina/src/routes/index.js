//Publicts Urls
const express = require('express');
const router = express.Router();
const pool = require('../database')
const {isNotLoggedIn} = require('../lib/auth')
router.get('/',isNotLoggedIn , async(req, res) => {
    const blogs = await pool.query('SELECT * FROM blog ORDER BY `create_at` DESC LIMIT 3');
    const news = await pool.query('SELECT * FROM news ORDER BY `create_at`DESC LIMIT 3')
    res.render('components/index', {blogs, news});
})

//post 
router.post('/addComent', isNotLoggedIn, async(req, res)=>{
    const {names, email, phone, mensaje} = req.body;
    const newMenssage = {
        names,
        email, 
        phone,
        mensaje,
        status: 'recivido'
    }
    await pool.query('INSERT INTO contact_us SET ?', [newMenssage]);
    res.redirect('/');
});

module.exports = router;
