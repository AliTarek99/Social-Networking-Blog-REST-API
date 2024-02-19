const { url } = require('inspector');
const Posts = require('../models/Posts');
const Users = require('../models/Users');
const deleteImage = require('../util/filesHelper').deleteImage;

const MAX_POSTS_IN_PAGE = 5;

exports.getHome = (req, res, next) => {
    let page = req.query.page || 1;
    Posts.countDocuments()
    .then(count => {
        Posts.find()
        .limit(MAX_POSTS_IN_PAGE)
        .skip((page - 1) * MAX_POSTS_IN_PAGE)
        .populate('creator')
        .then(posts => {
            posts.forEach(value => value.creator = {name: value.creator.name, picture: value.creator.picture, status: value.creator.status});
            res.status(200).json({
                posts: posts,
                totalItems: count,
                perPage: MAX_POSTS_IN_PAGE
            });
        })
    }).catch(err => next(err));
};

exports.getPost = (req, res, next) => {
    Posts.findById(req.params.postId)
    .then(post => {
        if(!post) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        post.id = post._id.toString();
        res.status(200).json({ message: 'Post fetched.', post: post });
    }).catch(err => next(err));
}

exports.createPost = (req, res, next) => {
    let post = new Posts();
    post.title = req.body.title;
    post.content = req.body.content;
    post.imageUrl = (req.file? req.file.path: undefined);
    post.creator = req.userId;
    post.save().then(p => {
        post = p;
        return Users.findById(p.creator);
    }).then(creator => {
        post.id = post._id.toString();
        res.status(201).json({message: 'Post created!', post: post, creator: {name: creator.name}});
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
            deleteImage(post.imageUrl);
            post.imageUrl = req.file.path;
        }
        return post.save();
    }).then(post => {
        post.id = post._id.toString();
        res.status(201).json({message: 'Post updated!', post: post});
    }).catch(err => next(err));
};

exports.deletePost = (req, res, next) => {
    Posts.findOneAndDelete({_id: req.params.postId, creator: req.userId}, {returnOriginal: true})
    .then(post => {
        if(post) {
            deleteImage(post.imageUrl);
            return res.status(200).json({ message: 'Deleted post.' });
        }
        const error = new Error('Could not find post.');
        error.statusCode = 404;
        throw error;
    }).catch(err => next(err));
};

exports.getStatus = (req, res, next) => {
    Users.findById(req.userId)
    .then(user => {
        if(!user) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({status: user.status})
    }).catch(err => next(err));
}

exports.editStatus = (req, res, next) => {
    Users.findById(req.userId)
    .then(user => {
        if(!user) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        if(req.body.status)
            user.status = req.body.status;
        return user.save();
    }).then(user => {
        res.status(201).json({status: user.status})
    }).catch(err => next(err));
}