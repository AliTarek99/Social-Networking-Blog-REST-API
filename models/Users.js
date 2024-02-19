const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Users = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    status: {
        type: String
    },
    passResetToken: {
        type: String
    },
    verificationToken: {
        type: String
    },
    resetExpiry: {
        type: Date
    },
});

module.exports = mongoose.model('Users', Users);