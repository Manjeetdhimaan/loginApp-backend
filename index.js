// newUser
//0rQfUS6zuvCjbcEA
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const port = process.env.PORT || 5000
const app = express(); 
app.use(cors());
app.use(express.json());
// Routes
const userRoutes = require('./api/UserRoutes');


app.get('/', (req, res)=>{
    res.send('hello')
})
app.use('/users', userRoutes);

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
mongoose.connect(process.env.MONGODB, {useUnifiedTopology:true})
.then(()=>{
    app.listen(port, ()=>{
        console.log('app running on port 5000 and connected with db')
    })
}).catch(err=>console.log(err))


