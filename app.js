const express = require('express');
const bodyParser = require('body-parser');
const feed = require('./routes/FeedRouter');

const app = express()

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(feed);

app.listen(8080);