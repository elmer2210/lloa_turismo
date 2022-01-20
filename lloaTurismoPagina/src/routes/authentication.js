//Authentication Urls
const express = require('express');
const { route } = require('.');
const router = express.Router();

const passport = require('passport')

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth');
const pool = require('../database');

//Login
router.get('/signin', isNotLoggedIn, (req, res) =>{
    res.render('auth/login')
})

router.post('/signin', isNotLoggedIn, (req, res, next)=>{
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash:true
    })(req, res, next);
})

//Register
router.get('/signup', (req, res)=>{
    res.render('auth/register')
})

router.post('/signup', isNotLoggedIn, 
    passport.authenticate('local.signup', {
        successRedirect:'/profile',
        failureRedirect:'/signup',
        failureFlash:true
    })
)

//profile
router.get('/profile',isLoggedIn,async(req, res)=>{
    const menssages = await pool.query('SELECT COUNT(*) AS numberMensage FROM contact_us WHERE status = "recivido"');
    res.render('auth/profile', {menssages:menssages[0]})
})

//logaut
router.get('/logaut', isLoggedIn, (req, res)=>{
    req.logOut();
    res.redirect('/signin');
})

module.exports = router;