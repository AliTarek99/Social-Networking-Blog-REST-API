const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Posts = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        creator: {
            type: mongoose.Types.ObjectId,
            ref: 'Users'
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Posts', Posts);