let express = require('express');
let db = require('../database/db');
let router = express.Router();


router.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('PrPose')
})

router.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})


module.exports = router;