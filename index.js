// newUser
//0rQfUS6zuvCjbcEA
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express();


const flash = require("connect-flash");
const session = require("express-session");

app.use(cors());
app.use(express.json());
// Routes
const userRoutes = require('./api/UserRoutes');
const adminRoutes = require('./api/adminRoutes');


app.get('/', (req, res) => {
    res.send('hello')
})
app.use(
    session({
        secret: "1e1df736",
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

// MongoClient.connect(process.env.MONGODB, function(err, db) {
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
mongoose.connect(process.env.MONGODB, { useUnifiedTopology: true })
    .then(() => {
        app.listen(port, () => {
            console.log(`app running on port ${port} and connected with db`)
        })
    }).catch(err => console.log(err))


