const { url } = require('inspector');
const Posts = require('../models/Posts');
const Users = require('../models/Users');
const fs = require('fs');

const MAX_POSTS_IN_PAGE = 10;

exports.getHome = (req, res, next) => {
    Posts.find({user: req.userId})
    .limit(MAX_POSTS_IN_PAGE)
    .skip((req.query.page - 1) * MAX_POSTS_IN_PAGE)
    .populate('creator')
    .then(posts => {
        res.status(200).json({posts: posts});
    }).catch(err => next(err));
};

exports.getPost = (req, res, next) => {
    
}

exports.createPost = (req, res, next) => {
    let post = new Posts();
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = (req.file? req.file.path: undefined);
    post.creator = req.userId;
    post.save().then(post => {
        post.id = post._id.toString();
        res.status(201).json(post);
    }).catch(err => next(err));
};

exports.editPost = (req, res, next) => {
    Posts.findById(req.params.postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        if (post.creator.toString() != req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        post.title = req.body.title;
        post.content = req.body.content;
        if(req.file) {
            deleteImage(post.image);
            post.image = req.file.path;
        }
        return post.save();
    }).then(post => {
        post.id = post._id.toString();
        res.status(201).json(post);
    }).catch(err => next(err));
};

exports.deletePost = (req, res, next) => {
    Posts.findOneAndDelete({_id: req.params.postId, creator: req.userId}, {returnOriginal: true})
    .then(post => {
        if(post) {
            deleteImage(post.image);
            return res.status(200).json({ message: 'Deleted post.' });
        }
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
    }).catch(err => next(err));
};

const deleteImage = url => {
    fs.rm(url)
}