const express = require('express');
const axios = require('axios');
const db = require('../database/db');
const router = express.Router();

const instance = axios.create({
    baseURL: 'https://api.uclassify.com/v1',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token zdOP4kz6GcGQ'
    }
})

router.get('/all', (req, res) => {
    if (req.query.sort){
        console.log('onjo')
        switch (req.query.sort) {
            case 'new':
                    db.query('SELECT * FROM ?? ORDER BY ?? DESC',
                        ['posts', 'publication_date'], (err, rows) => {
                            if (err) {
                                res.sendStatus(500);
                                res.end()
                            }
                            res.send(rows)
                        })
                break;
            case 'best': //TODO: corriger la query
                    db.query('SELECT ??.*, count(??) AS positive, count(??) AS negative, (SELECT ((positive + 1.9208) / (positive + negative) - 1.96 * SQRT((positive * negative) / (positive + negative) + 0.9604) /(positive + negative)) / (1 + 3.8416 / (positive + negative))) AS ci_lower_bound FROM ??, ?? p JOIN ?? p1 WHERE (SELECT positive + negative > 0) ORDER BY ci_lower_bound DESC HAVING positive = 1 AND negative = 0;',
                        ['posts', 'p1.upvote', 'p.upvote', 'posts', 'post_vote', 'post_vote'], (err, rows) => {
                            if (err) {
                                console.log(err)
                                res.sendStatus(500);
                                res.end()
                            }
                            res.send(rows)
                        })
                break;
            default:
                res.sendStatus(500)
        }
    }
    else {
        console.log('k')
        db.query('SELECT * FROM ??',
            ['posts'], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.send(rows)
            })
    }
     
})

router.route('/:postID') //post avec ses commentaires
    .get((req, res) => {
        db.query('SELECT * FROM ?? WHERE posts.post_id = ?', //TODO: mettre
            ['posts', req.params.postID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
    })
    .put((req, res) =>{ //On ne prvoie pas d'autoriser la modification d'une publication pour garder le thème d'origine et ne pas avoir à le changer pour cette publication.
        // const method = req.method; const routePath = req.route.path; const query = req.query;
        // console.log({ method, routePath, query });
        // db.query(
        //     'UPDATE ?? SET ?? = ?  WHERE post_id = ?',
        //     ['posts', 'content', req.body.postContent, req.params.postID], function (err, rows) {
        //         if (err) {
        //             res.sendStatus(500);
        //             res.end()
        //         }
        //         res.json(rows)
        //     }
        // )
    })
    .delete((req, res) =>{
        if (req.session.isLoggedIn){
            db.query('SELECT ?? FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = ?', 
            ['posts.username', 'posts', 'users', 'posts.username', 'users.username', 'posts.username', req.session.username, 'posts.post_id', req.params.postID], (err, rows) => {
                if (rows.length > 1){
                    db.query('DELETE FROM ?? where posts.post_id = ?',
                        ['posts', req.params.postID], (err, rows) => {
                            if (err) {
                                res.sendStatus(500);
                                res.end;
                            }
                            res.send(rows)
                        })
                }
                else {
                    res.sendStatus(401)
                }
            })
        }
        else {
            res.sendStatus(401)
        } 
    });

//Seulement les commentaires 'racine', ceux qui n'ont pas de parents
router.get('/:postID/comments', (req, res) => {
    db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.comment_id_parent = NULL AND comments.post_id = ?',
        ['comments', 'posts', req.params.postID], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows)
        })
})

router.get('/:postID/themes', (req, res) => {
        db.query(
            'SELECT themes.* FROM ??, ??, ?? WHERE post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND posts.post_id = ?', //TODO;mettre a jour
            ['posts', 'post_theme', 'themes', req.params.postID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
})

// router.get('/:postID/vote',(req, res) => {
//     const method = req.method; const routePath = req.route.path; const query = req.query;
//     console.log({ method, routePath, query });
//     db.query('SELECT post_vote.* FROM ??, ??, ?? WHERE post_vote.username = users.username AND post_vote.post_id = posts.post_id AND post_vote.post_id = ? AND post_vote.username = ?',
//     ['posts', 'post_vote', 'users', req.params.postID, req.body.loggedUser], function(err, rows){
//         if(err){
//             res.sendStatus(500);
//             res.end()
//         }
//         res.json(rows)
//     })
// })

router.get('/:postID/upvotes', (req, res) => {
    db.query('SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 1',
        ['posts','post_vote', req.params.postID], (err, rows) => {
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        res.send(rows)
    })
})

router.get('/:postID/downvotes', (req, res) => {
    db.query('SELECT count(??.*) FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = 0',
        ['post_vote', 'posts', 'post_vote', 'posts.post_id', 'post_vote.post_id', 'post_vote.post_id', req.params.postID, 'post_vote.upvote'], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('/:postID/upvote', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
            ['post_vote', 'upvote', 'username', 'post_id', 1, req.session.username, req.body.postID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end;
                }
                res.send(rows)
            })
    }
    else {
        res.sendStatus(401)
    }
})

router.post('/:postID/downvote', (req, res) => {
    if (req.session.isLoggedIn){
        db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
            ['post_vote', 'upvote', 'username', 'post_id', 0, req.session.username, req.body.postID], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end;
                }
                res.send(rows)
            })
    }
    else {
        res.sendStatus(401)
    }
})

router.post('/newPost', (req, res) => {
    //Si un utilisateur est connecté
    if (req.session.isLoggedIn){
        const contentToClassify = JSON.stringify({ texts: [req.body.postContent] })
        instance.post('/uclassify/topics/fr/classify', contentToClassify)
            .then((response) => {
                //console.log(response.data[0].classification);
                if (response.data[0].textCoverage >= 0.5) {
                    const categories = relevantCategories(response.data[0])
                    //console.log(categories)
                    db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
                        ['posts', 'username',  'title', 'content', req.session.username, req.body.postTitle, req.body.postContent], (err, rows) => {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                res.end;
                            }
                            console.log(rows)
                            const postID = rows.insertId
                            //console.log('postID créé: ', postID)
                            for (index = 0; index < categories.length; index++){
                                db.query('INSERT INTO ??(??, ??) VALUES (?, ?);',
                                    ['post_theme', 'post_id', 'theme', postID, categories[index]]);
                            }
                            //res.sendStatus(200);
                            res.send(rows)
                        })
                }
                else {
                    res.sendStatus(500);
                }
            })
            .catch((error) => {
                console.log(error);
                res.sendStatus(500);
            });
        
    }
    else{
        res.sendStatus(401);
    }    
})

router.post('/newChildPost', (req, res) => { 
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('',
    [], (err, rows) => {
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        console.log('posttID créé: ', rows.insertId)
        res.send(rows)
    })
})

//On veut prendre seulement les catégories qui sont pertinentes
function relevantCategories(data){
    //Remarque: possibilité de sort(function (a,b){return a.p > b.p;}) au lieu de passer par un Map
    var probaOfCategory = new Map([]);
    data.classification.forEach(category => {
        //console.log(`Name: ${category.className}, Confidence: ${category.p}`);
        probaOfCategory.set(category.p, category.className);
    });
    //On prend les probabilité, on les tri dans l'ordre décroissant
    const probabilities = Array.from(probaOfCategory.keys()).sort().reverse()
    //On supprime les probabilités qui ne sont pas assez grandes
    for(index = 1; index < probabilities.length; index++) {
        if (probabilities[0] - probabilities[index] > 0.1) { //0.1 est un chiffre arbitraire
            probabilities.splice(index, probabilities.length - index);
        }
    }
    return getCategories(probabilities, probaOfCategory) //On retourne les catégories auxquels correspondent les probabilités de l'Array probabilities
}

function getCategories(probabilities, probabilitiesMap){ 
    const categories = []
    for(index = 0; index < probabilities.length; index++) {
        categories.push(probabilitiesMap.get(probabilities[index]))

    }
    return categories;
}

module.exports = router;