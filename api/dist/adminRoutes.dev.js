"use strict";

var router = require('express').Router();

var Admin = require('../models/Admin');

var User = require('../models/User');

var MongoClient = require('mongodb').MongoClient;

router.post('/adminLogin', function (req, res) {
  MongoClient.connect(process.env.MONGODB, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    dbo.collection("admin").findOne({
      email: req.body.email,
      password: req.body.password
    }).then(function (user) {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401).json({
          error: 'You are not Admin!'
        });
      }
    })["catch"](function (err) {
      res.status(500).json({
        error: err.message
      });
    });
  });
});
router.get('/', function (req, res) {
  MongoClient.connect(process.env.MONGODB, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    dbo.collection("admin").findOne({}, function (err, result) {
      if (err) throw err;
      res.send(result);
      db.close();
    });
  });
});
router.post('/updateAdminCredentials/:id', function (req, res) {
  MongoClient.connect(process.env.MONGODB, function (err, db) {
    if (err) throw err;
    var dbo = db.db("myFirstDatabase");
    var credentials = {
      email: req.body.email,
      password: req.body.password
    };

    if (!req.body.email) {
      delete credentials.email;
    }

    if (!req.body.password) {
      delete credentials.password;
    }

    dbo.collection("admin").updateOne({
      id: req.body.id
    }, {
      $set: credentials
    }, {
      "new": true
    }, function (err, article) {
      if (err) return handleError(err);
      res.send(req.body);
    });
  });
});
module.exports = router;