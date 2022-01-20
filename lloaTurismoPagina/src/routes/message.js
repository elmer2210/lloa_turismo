//Publicts Urls
const express = require('express');
const router = express.Router();
const pool = require('../database')
const {isNotLoggedIn, isLoggedIn} = require('../lib/auth')

//get 
router.get('/', isLoggedIn, async(req, res)=>{
    const menssages = await pool.query('SELECT * FROM contact_us WHERE status = "recivido"');
    const menssageReading = await pool.query('SELECT * FROM contact_us WHERE status = "leido"')
    res.render('menssage/show', {menssages, menssageReading})
});

router.get('/delete/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const msj = await pool.query('SELECT * FROM contact_us WHERE id = ?', [id]);
    if (msj.length > 0) {
        await pool.query('DELETE FROM contact_us WHERE id = ?', [id]);
        req.flash('success', 'El mensaje fue eliminado con exito')
        res.redirect('/menssage')
    } else {
        req.flash('message', 'No se pudo eliminar el mensaje, vuelva a intentarlo');
        res.redirect('/menssage');
    }
});

router.get('/statusChange/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const msj = await pool.query('SELECT * FROM contact_us WHERE id = ?', [id]);
    if (msj[0].status === 'recivido') {
        const newMsj = {
            status : 'leido',
            user_id: req.user.id
        };
        await pool.query('UPDATE contact_us SET ? WHERE id = ?',[newMsj, id]);
        req.flash('success', 'El estatado del mensaje fue cambiado a "Leído"')
        res.redirect('/menssage')
    } else {
        const newMsj = {
            status : 'recivido',
            user_id: req.user.id
        };
        await pool.query('UPDATE contact_us SET ? WHERE id = ?',[newMsj, id]);
        req.flash('success', 'El estatado del mensaje fue cambiado a "Recivido"')
        res.redirect('/menssage')
    }
});

module.exports = router;