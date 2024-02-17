const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Posts = new Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    date: {
        type: Date
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'Users'
    }
})

module.exports = mongoose.model('Posts', Posts);