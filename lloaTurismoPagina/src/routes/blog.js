//Crud Urls
const express = require('express');
const router = express.Router();
const pool = require('../database')
const fs = require('fs').promises;
const path = require('path');
const {isLoggedIn, isNotLoggedIn} = require('../lib/auth')

//routes 

router.get('/', isNotLoggedIn,async (req, res)=>{
    const blogs = await pool.query('SELECT * FROM blog ORDER BY `create_at` DESC');
    res.render('blog/index', {blogs});
});

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
    res.redirect('/blog/show')
});

router.get('/show', isLoggedIn, async(req, res)=>{
    const blog = await pool.query('SELECT * FROM blog WHERE create_for =? ORDER BY `create_at` DESC', [req.user.id]);
    res.render('blog/show', {blog})
});

router.get ('/individual/:id', async(req, res)=>{
    const {id} = req.params;
    const blog = await pool.query('SELECT * FROM blog WHERE id = ?', [id]);
    res.render('blog/blog', {blog:blog[0]} );
});

router.get ('/edit/:id',isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const blog = await pool.query('SELECT * FROM blog WHERE id = ?', [id]);
    res.render('blog/edit', {blog:blog[0]} );
});

router.post('/edit/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const blog = await pool.query('SELECT * FROM blog WHERE id = ?',[id] );
    const {title, resumen, text, image} = req.body;
        const updateBlog = {
            title,
            resumen,
            text,
            image:req.file.filename,
        };
    if (blog[0].image !== null) {
        fs.unlink( path.join(__dirname, `../public/img/img_uploads/${blog[0].image}`))
            .then(()=>{
                console.log('images was removed')
            }).catch(err=>{
                console.error('Something wrong happened removing the file', err)
            })
    };
    console.log(updateBlog)
    await pool.query('UPDATE blog SET ? WHERE id = ?', [updateBlog, id])
    req.flash('success', 'Blog actualizado correctamentes')
    res.redirect('/blog/show')
});

router.get('/delete/:id', isLoggedIn, async(req, res)=>{
    const {id} = req.params;
    const blog = await pool.query('SELECT * FROM blog WHERE id =?', [id])
    if (blog.length > 0) {
        if (blog[0].image !== null) {
            fs.unlink( path.join(__dirname, `../public/img/img_uploads/${blog[0].image}`))
                .then(()=>{
                    console.log('images was removed')
                }).catch(err=>{
                    console.error('Something wrong happened removing the file', err)
                })
        };

        const dlBlog = await pool.query('DELETE FROM blog WHERE id = ?', [id]);
        req.flash('success', 'Blog eliminado satisfactoriamente');
        res.redirect('/blog/show')
    } else {
        req.flash('message', 'No se encuentra el blog que desea eliminar')
    }
});

module.exports = router;