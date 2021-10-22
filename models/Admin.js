const  mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required: false
    },
    password:{
        type:String,
        required: false
    }
});

module.exports = mongoose.model('Admin', AdminSchema)