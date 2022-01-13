//Publicts Urls
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.render('components/index');
})

module.exports = router;
