const express = require('express');
const bodyParser = require('body-parser');
const feed = require('./routes/FeedRouter');
const auth = require('./routes/AuthRouter');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const jwtHelper = require('./util/isAuth');


const dbUrl = 'mongodb+srv://alitarek:0000@cluster0.yt1qvle.mongodb.net/socialNetworkingBlog?retryWrites=true&w=majority';

const app = express();

app.use(bodyParser.json());
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(req.body.title)
            cb(null, path.join('Data', 'postImages'));
        else if(req.body.email) {
            cb(null, path.join('Data', 'profilePic'));
        }
    },
    filename: function (req, file, cb) {
        if(req.body.title)
            cb(null, `${new Date().getTime()}-${file.originalname}`);
        else if(req.body.email) {
            if(jwtHelper.decode(req))
                cb(null, req.userId);
            else
                cb(new Error('Not authorized!'));
        }
    },
})

const upload = multer({
    storage: storage, 
    fileFilter: function(req, file, cb) {
        if(file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')
            cb(null, true);
        else
            cb(null, false);
    }
}).single('image');

app.use('data/postImages', (req, res, next) => {
    res.setHeader('Content-Type', 'image/png');
    next();
}, express.static(path.join('data', 'postImages')));

app.use('data/profilePics', (req, res, next) => {
    res.setHeader('Content-Type', 'image/png');
    next();
}, express.static(path.join('data', 'profilePics')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/feed', feed);
app.use('/auth', auth);

app.use((error, req, res, next) => {
    console.log(error);
    error.statusCode = error.statusCode || 500;
    res.status(error.statusCode).json({ message: error.message, data: error.data });
})

mongoose.connect(dbUrl).then(() => {
    app.listen(8080);
});