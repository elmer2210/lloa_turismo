//Crud Urls
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const pool = require('../database')
const path = require('path');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

//routes get
router.get('/',isNotLoggedIn ,async(req, res) => {
    const news = await pool.query('SELECT * FROM news WHERE `status` = "actived" ORDER BY `event_date` ASC');
    res.render('news/index', {news});
});

router.get('/show', isLoggedIn, async(req, res)=>{
    const news = await pool.query('SELECT * FROM news WHERE `create_for` = ? ORDER BY `event_date` ASC', [req.user.id]);
    res.render('news/show', {news});
});

router.get('/add', isLoggedIn, async(req, res)=>{
    res.render('news/create')
});

router.get('/individual/:id', async(req, res)=>{
    const {id} = req.params;
    const event = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    res.render('news/event', {new:event[0]} )
});

router.get('/edit/:id', isLoggedIn, async(req, res)=>{
    const{id} = req.params;
    const event = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    res.render('news/edit', {new:event[0]} );
});

router.get('/delete/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const blog = await pool.query('SELECT * FROM news WHERE id =?', [id])
    if (blog.length > 0) {
        if (blog[0].file !== null) {
            fs.unlink( path.join(__dirname, `../public/img/img_uploads/${blog[0].file}`))
                .then(()=>{
                    console.log('images was removed')
                }).catch(err=>{
                    console.error('Something wrong happened removing the file', err)
                })
        };

        await pool.query('DELETE FROM blog WHERE id = ?', [id]);
        req.flash('success', 'Evento/notica eliminado satisfactoriamente');
        res.redirect('/blog/show')
    } else {
        req.flash('message', 'No se encuentra el evento/noticia que desea eliminar')
    }
});

router.get('/statusChange/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const event = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (event.length >0) {
        if (event[0].status === 'actived') {
            const newStatus = {
                status : 'disabled'
            }
            await pool.query('UPDATE news SET ? WHERE id = ?', [newStatus, id])
            req.flash('success', 'El estatado del evento/noticia fue cambiado a "Desactivado"')
            res.redirect('/new/show')
        } else {
            const newStatus = {
                status : 'actived'
            }
            await pool.query('UPDATE news SET ? WHERE id = ?', [newStatus, id])
            req.flash('success', 'El estatado del evento/noticia fue cambiado a "Activado"')
            res.redirect('/new/show')
        }
      
    } else {
        req.flash('message', 'Error al cambiar el estado del registro')
        res.redirect('/new/show')        
    }
});

//routes post
router.post('/add', isLoggedIn, async(req, res)=>{
    const {title_new, event_date, text, status} = req.body;
    const newEvent = {
        title_new,
        file:req.file.filename,
        event_date,
        status,
        text,
        create_for: req.user.id
    };
    await pool.query('INSERT INTO news SET ?', [newEvent]);
    req.flash('success', 'El evento/noticia fue creado satisfactoriamente');
    res.redirect('/new/show');
});

router.post('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const{title_new, event_date, status, text} = req.body;
    const event = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
    if (event.length>0) {
        const updateEvent = {
            title_new,
            file: req.file.filename,
            event_date,
            status,
            text
        }
        await pool.query('UPDATE news SET ? WHERE id = ? ', [updateEvent, id]);

        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${event[0].file}`))
        .then(()=>{
            console.log('images was removed')
        }).catch(err=>{
            console.error('Something wrong happened removing the file', err)
        });

        req.flash('success', 'Evento/Noticia fue actualizado satisfactoriamente')
        res.redirect('/new/show')
    } else {
        req.flash('message', 'Error al actualizar el evento/noticia, vuelva a intentarlo');
        res.redirect(`/new/edit/${event[0].id}`)        
    }
});


module.exports = router;