let express = require('express');
let app = express();
let db = require('./db.js');
let bodyParser = require('body-parser');



app.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))

.get('/', function(req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.send('Hello World!')
})

.get('/posts', function(req, res){
    db.query(
        'SELECT * FROM posts',
        function(err, rows){
            if (err){
                res.sendStatus(500);
                res.end()
            }

            var posts = rows.map((row) => {
                return 
            })

            res.send(rows)
        }
    )
})

.get('/users', function(req,res){
    db.query(
        'SELECT * FROM user',
        function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var users = rows.map((row) => {
                return
            })

            res.send(rows)
        }
    )
})


.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})

.listen(3000, function () {//App sur le port 4000
    console.log('Server port 3000')
});