//Crud Urls
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const pool = require('../database')
const path = require('path');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

//routes get
router.get('/', isNotLoggedIn, async(req, res)=>{
    const videos = await pool.query('SELECT * FROM videos ORDER BY create_at DESC');
    res.render('videos/index', {videos});
})

router.get('/show', isLoggedIn, async(req, res)=>{
    const {id} = req.user;
    const videos = await pool.query('SELECT * FROM videos WHERE create_for = ? ORDER BY create_at DESC', [id]);
    res.render('videos/show', {videos})
})

router.get('/add', isLoggedIn, async(req, res)=>{
    res.render('videos/create')
});

router.get('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const video = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    res.render('videos/edit', {video: video[0]})
});

router.get('/delete/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const video = await  pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (video.length>0) {
        await pool.query('DELETE FROM videos WHERE id = ?', [id]);

        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${video[0].file}`))
        .then(()=>{
            console.log('images was removed')
        }).catch(err=>{
            console.error('Something wrong happened removing the file', err)
        });

        req.flash('success', 'Video Eliminado correptamente');
        res.redirect('/video/show')
    } else {
        req.flash('message', 'No se pudo eliminar la imagen vuelva a intentarlo');
        res.redirect('video/show')
    }
});

//routes post
router.post('/add', isLoggedIn, async(req, res)=>{
    const {title, description} = req.body;
    const newVideo = {
        title,
        description,
        file: req.file.filename,
        create_for : req.user.id
    };
    await pool.query('INSERT INTO videos SET ?', [newVideo]);
    req.flash('success', 'Video cargado con exito');
    res.redirect('/video/show')
});

router.post('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const {title, description} = req.body;
    const video = await pool.query('SELECT * FROM videos WHERE id = ?', [id]);
    if (video.length>0) {
        const updateVideo = {
            title,
            description,
            file: req.file.filename,
        };
        await pool.query('UPDATE videos SET ? WHERE id = ?', [ updateVideo,id]);

        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${video[0].file}`))
        .then(()=>{
            console.log('images was removed')
        }).catch(err=>{
            console.error('Something wrong happened removing the file', err)
        });

        req.flash('success', 'Registro del video actualizado correctamente');
        res.redirect('/video/show');
    } else {
        req.flash('message', 'Error al actualizar el registro de la imagen, vuelva a intentarlo');
        res.redirect(`/video/edit/${id}`)
    }
});

module.exports = router;