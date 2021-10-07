const  mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Please enter an email address']
    },
    password:{
        type:String,
        required: [true, 'Please enter a password']
    }
});

module.exports = mongoose.model('Admin', AdminSchema)