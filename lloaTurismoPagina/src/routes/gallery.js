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

router.get('/add', isLoggedIn, async(req, res)=>{
    res.render('gallery/create')
});

router.get('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const photo = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    res.render('gallery/edit', {photo: photo[0]})
});

router.get('/delete/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const photo = await  pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    if (photo.length>0) {
        await pool.query('DELETE FROM gallery WHERE id = ?', [id]);

        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${photo[0].image}`))
        .then(()=>{
            console.log('images was removed')
        }).catch(err=>{
            console.error('Something wrong happened removing the file', err)
        });

        req.flash('success', 'Imagen Eliminada correptamente');
        res.redirect('/gallery/show')
    } else {
        req.flash('message', 'No se pudo eliminar la imagen vuelva a intentarlo');
        res.redirect('gallery/show')
    }
});

//routes post
router.post('/add', isLoggedIn, async(req, res)=>{
    const {title, description} = req.body;
    const newPhoto = {
        title,
        description,
        image: req.file.filename,
        create_for : req.user.id
    };
    await pool.query('INSERT INTO gallery SET ?', [newPhoto]);
    req.flash('success', 'Imagen cargada con exito');
    res.redirect('/gallery/show')
});

router.post('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const {title, description} = req.body;
    const photo = await pool.query('SELECT * FROM gallery WHERE id = ?', [id]);
    console.log(photo)
    if (photo.length>0) {
        const updatePhoto = {
            title,
            description,
            image: req.file.filename,
        };
        await pool.query('UPDATE gallery SET ? WHERE id = ?', [ updatePhoto,id]);

        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${photo[0].image}`))
        .then(()=>{
            console.log('images was removed')
        }).catch(err=>{
            console.error('Something wrong happened removing the file', err)
        });

        req.flash('success', 'Registro de imagen actualizada correctamente');
        res.redirect('/gallery/show');
    } else {
        req.flash('message', 'Error al actualizar el registro de la imagen, vuelva a intentarlo');
        res.redirect(`/gallery/edit/${id}`)
    }
});

module.exports = router;