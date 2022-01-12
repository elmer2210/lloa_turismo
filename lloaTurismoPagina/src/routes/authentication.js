//Authentication Urls
const express = require('express');
const { route } = require('.');
const router = express.Router();

const passport = require('passport')

const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

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
router.get('/signup', isNotLoggedIn, (req, res)=>{
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
router.get('/profile',isLoggedIn,(req, res)=>{
    res.render('auth/profile')
})

//logaut
router.get('/logaut', isLoggedIn, (req, res)=>{
    req.logOut();
    res.redirect('/signin');
})

module.exports = router;