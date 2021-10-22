"use strict";

// newUser
//0rQfUS6zuvCjbcEA
require('dotenv').config();

var express = require('express');

var mongoose = require('mongoose');

var MongoClient = require('mongodb').MongoClient;

var cors = require('cors');

var port = process.env.PORT || 5000;
var app = express();

var flash = require("connect-flash");

var session = require("express-session");

app.use(cors());
app.use(express.json()); // Routes

var userRoutes = require('./api/UserRoutes');

var adminRoutes = require('./api/adminRoutes');

app.get('/', function (req, res) {
  res.send('hello');
});
app.use(session({
  secret: "1e1df736",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use('/users', userRoutes);
app.use('/admin', adminRoutes); // MongoClient.connect(process.env.MONGODB, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("myFirstDatabase");
//     var myquery = { firstname: "Shalu" };
//     var newvalues = { $set: { firstname: "Michael", lastname: "Canyon" } };
//     dbo.collection("users").updateOne(myquery, newvalues, function(err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       db.close();
//     });
//   });
//  mongodb+srv://newUser:<password>@cluster0.qcyjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

mongoose.connect(process.env.MONGODB, {
  useUnifiedTopology: true
}).then(function () {
  app.listen(port, function () {
    console.log("app running on port ".concat(port, " and connected with db"));
  });
})["catch"](function (err) {
  return console.log(err);
});