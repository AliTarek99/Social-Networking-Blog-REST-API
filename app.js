const express = require('express');
const bodyParser = require('body-parser');
const feed = require('./routes/FeedRouter');
const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://alitarek:0000@cluster0.yt1qvle.mongodb.net/socialNetworkingBlog?retryWrites=true&w=majority'

const app = express()

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(feed);

mongoose.connect(dbUrl).then(() => {
    app.listen(8080);
});