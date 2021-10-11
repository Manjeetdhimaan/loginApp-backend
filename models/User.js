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
    phone:{
        type:String,
        required: [true, 'Provide your mobile number']
    },
    leaves:{
        type:Object,
        required: false
    },
    remainingLeaves:{
        type:String,
        required: false
    },
    totalLeaves:{
        type:String,
        required: false
    },
    appliedLeaves:{
        type:String,
        required: false
    },
    camps:{
        type:Object,
        required: false
    },
});

module.exports = mongoose.model('User', UserSchema)