let express = require('express');
let db = require('../database/db');
let router = express.Router();



router.get('/posts', (req, res) => {
    //res.setHeader();
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({method, path, query})
    db.query(
        'SELECT * FROM ??',
        ['posts'], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var posts = rows.map((row) => {
                return
            })

            res.send(rows)
        })
})

router.route('/post/:postID') //post avec ses commentaires
    .get((req, res) => {
        let method = req.method; let path = req.route.path; let query = req.query;
        console.log({ method, path, query })
        db.query(
            'SELECT * FROM ?? WHERE ??.post_id = ?',
            ['posts', 'posts', req.params.postID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }

                var posts = rows.map((row) => {
                    return
                })

                res.json(rows)
            })
    })
    .put((req, res) =>{
        let method = req.method; let path = req.route.path; let query = req.query;
        console.log({ method, path, query })
        db.query(
            'UPDATE ?? SET ?? = ?  WHERE post_id = ?',
            ['posts', 'content', req.body.postContent, req.params.postID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }

                res.json(rows)
            }
        )
    })
    .delete((req, res) =>{
        let method = req.method; let path = req.route.path; let query = req.query;
        console.log({ method, path, query })
        db.query('DELETE FROM ?? where posts.post_id = ?',
        ['posts', req.params.postID], function(err, rows){
            if (err){
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
    });

//Seulement les commentaires 'racine', ceux qui n'ont pas de parents
router.get('/post/:postID/comments', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.comment_id_parent = NULL AND comments.post_id = ?',
        ['comments', 'posts', req.params.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows)
        })
})

router.get('/post/:postID/vote',(req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('SELECT post_vote.* FROM ??, ??, ?? WHERE post_vote.username = users.username AND post_vote.post_id = posts.post_id AND post_vote.post_id = ? AND post_vote.username = ?',
    ['posts', 'post_vote', 'users', req.params.postID, req.body.loggedUser], function(err, rows){
        if(err){
            res.sendStatus(500);
            res.end()
        }
        res.json(rows)
    })
})

router.get('post/:postID/upvotes', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 1',
        ['posts','post_vote', req.params.postID], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        res.send(rows)
    })
})

router.get('post/:postID/downvotes', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 0',
        ['posts', 'post_vote', req.params.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('post/:postID/vote', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('INSERT INTO post_vote(??, ??, ??) VALUES (?, ?, ?)', 
        ['upvote', 'username', 'post_id', req.body.upvote, req.body.loggedUser, req.body.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        }) 
    

    
})


router.post('/createPost', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    console.log('body: ', req.body)
    //var postData = req.body
    db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
        ['posts', 'username', 'theme', 'title', 'content', req.body.username, req.body.postTheme, req.body.postTitle, req.body.postContent], function(err, rows, fields){
        if (err) {
            console.log(err)
            res.sendStatus(500);
            res.end;
        }
        console.log('postID créé: ', rows.insertID)
        res.send(rows)

    })
})

router.post('/createChildPost', (req, res) => {
    let method = req.method; let path = req.route.path; let query = req.query;
    console.log({ method, path, query })
    db.query('',
    [], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        console.log('posttID créé: ', rows.insertID)
        res.send(rows)
    })
})

// router.route('/post/:postID/:commentID') //post et le commentaire i
//     .get((req, res) => {
//         db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.post_id = ? AND',
//             ['comments', 'posts', req.params.postID], function (err, rows) {
//                 if (err) {
//                     res.sendStatus(500);
//                     res.end()
//                 }
//                 res.json(rows)
//             })
//     })
//     .post((req, res) => {

//     })
//     .delete((req, res) => {

//     });




module.exports = router;