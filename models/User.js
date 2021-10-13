const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email address'],
        trim: true
    },
    fullname: {
        type: String,
        required: [true, 'Please enter full name'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        trim: true
    },
    service: {
        type: String,
        required: [true, 'Please enter a service'],
        trim: true
    },
    bio: {
        type: String,
        required: [false, 'Please enter bio'],
        trim: true
    },
    pic: {
        type: String,
        required: [true, 'Please enter a pic url'],
        trim: true
    },
    isServiceProvider: {
        type: Boolean,
        required: [true, 'Are you a service provider?'],
        trim: true
    },
    joindate: {
        type: Date,
        required: [true, 'Joining date?'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Provide your mobile number'],
        trim: true
    },
    leaves: {
        type: Object,
        required: false,
        trim: true
    },
    remainingLeaves: {
        type: String,
        required: false,
        trim: true
    },
    totalLeaves: {
        type: String,
        required: false,
        trim: true
    },
    appliedLeaves: {
        type: String,
        required: false,
        trim: true
    },
    camps: {
        type: Object,
        required: false,
        trim: true
    },
    attendance: [{
        date: {
            type: Date,
            default: Date.now,
        },
        entry: { type: Date },
        exit: {
            time: {
                type: Date
            },
            // 1 - General
            // 2 - Vacation
            // 3 - Doctor
            exitType: String
        }

    }]
}, {
    usePushEach: true
})

module.exports = mongoose.model('User', UserSchema)