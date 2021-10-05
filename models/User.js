const  mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Please enter an email address']
    },
    fullname:{
        type:String,
        required: [true, 'Please enter full name']
    },
    password:{
        type:String,
        required: [true, 'Please enter a password']
    },
    service:{
        type:String,
        required: [true, 'Please enter a service']
    },
    bio:{
        type:String,
        required: [true, 'Please enter bio']
    },
    pic:{
        type:String,
        required: [true, 'Please enter a pic url']
    },
    isServiceProvider:{
        type:Boolean,
        required: [true, 'Are you a service provider?']
    },
    joindate:{
        type:Date,
        required: [true, 'Joining date?']
    },
});

module.exports = mongoose.model('User', UserSchema)