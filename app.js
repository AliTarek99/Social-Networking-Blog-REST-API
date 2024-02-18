const express = require('express');
const bodyParser = require('body-parser');
const feed = require('./routes/FeedRouter');
const auth = require('./routes/AuthRouter');
const mongoose = require('mongoose');

const dbUrl = 'mongodb+srv://alitarek:0000@cluster0.yt1qvle.mongodb.net/socialNetworkingBlog?retryWrites=true&w=majority';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(feed);
app.use(auth);

app.use((error, req, res, next) => {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    res.status(error.statusCode).json({ message: error.message, data: error.data });
})

mongoose.connect(dbUrl).then(() => {
    app.listen(8080);
});