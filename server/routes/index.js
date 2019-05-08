let express = require('express');
let db = require('../database/db');
let bodyParser = require('body-parser');
let router = express.Router();


router.get('/', function (req, res) {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    res.setHeader('Content-Type', 'text/plain');
    res.send('PrPose')
})



module.exports = router;