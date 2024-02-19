const express = require('express');
const feedController = require('../controllers/Feed');
const jwtHelper = require('../util/isAuth');

const router = express.Router();

router.get('/posts', jwtHelper.isAuth, feedController.getHome);

router.get('/status', jwtHelper.isAuth, feedController.getStatus);

router.put('/status', jwtHelper.isAuth, feedController.editStatus);

router.get('/post/:postId', jwtHelper.isAuth, feedController.getPost);

router.post('/post', jwtHelper.isAuth, feedController.createPost);

router.put('/post/:postId', jwtHelper.isAuth, feedController.editPost);

router.delete('/post/:postId', jwtHelper.isAuth, feedController.deletePost);

module.exports = router;