const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helpers = require('./helpers')

const pool = require('../database');

passport.use('local.signin', new LocalStrategy({
    usernameField:'user_name',
    passwordField:'password',
    passReqToCallback:true
}, async(req, user_name, password, done)=>{
    const rows = await pool.query('SELECT * FROM users WHERE user_name = ?', [user_name])
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.getPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success','Bienvenido ' + user.user_name))
        } else {
            done(null, false, req.flash('message', 'Contraseña no es correcta') )
        }
    } else {
        return done(null, false, req.flash('message','El nombre del usuario no existe'))
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'user_name',
    passwordField: 'password',
    passReqToCallback: true,
}, async(req, user_name, password, done)=>{
    console.log(req.body)
    const {first_name, last_name, user_email} = req.body
    const newUser = {
        user_name,
        password,
        first_name,
        last_name,
        user_email 
    };
    console.log(newUser)
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser])
    newUser.id = result.insertId;
    return done(null, newUser)
}));

passport.serializeUser((usr, done)=>{
    done(null, usr.id)
});

passport.deserializeUser(async(id, done)=>{
    const query = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, query[0])
})