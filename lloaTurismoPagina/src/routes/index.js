//Publicts Urls
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.render('components/index');
})

router.get('/gallery', (req, res) => {
    res.render('components/gallery');
})

module.exports = router;
