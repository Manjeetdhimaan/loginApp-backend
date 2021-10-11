const router = require('express').Router();
const Admin = require('../models/Admin');
var MongoClient = require('mongodb').MongoClient;

router.post('/adminLogin', (req, res) => {
    MongoClient.connect(process.env.MONGODB, (err, db) => {
        if (err) throw err;
        var dbo = db.db("myFirstDatabase");
        dbo.collection("admin").findOne({ email: req.body.email, password: req.body.password }).then(user => {
            if (user) {
                res.status(200).json(user)
            }
            else {
                res.status(401).json({ error: 'You are not Admin!' })
            }
        }).catch(err => {
            res.status(500).json({ error: err.message })
        })
    });
    
    // Admin.findOne({ email: req.body.email, password: req.body.password }).then(user => {
    //     if (user) {
    //         res.status(200).json(user)
    //     }
    //     else {
    //         res.status(401).json({ error: 'You are not Admin!' })
    //     }
    // }).catch(err => {
    //     res.status(500).json({ error: err.message })
    // })
})

module.exports = router;