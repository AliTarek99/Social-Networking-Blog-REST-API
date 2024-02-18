const express = require('express');
const feedController = require('../controllers/Feed');
const jwtHelper = require('../util/isAuth');

const router = express.Router();

router.get('/posts', jwtHelper.isAuth, feedController.getHome);

router.get('/posts/:postId', jwtHelper.isAuth, feedController.getPost);

router.post('/post', jwtHelper.isAuth, feedController.createPost);

router.put('/post/:postId', jwtHelper.isAuth, feedController.editPost);

router.delete('/delete/:postId', jwtHelper.isAuth, feedController.deletePost);

module.exports = router;