const express = require('express');
const feedController = require('../controllers/Feed');

const router = express.Router();

router.get('/', feedController.getHome);

router.post('/post', feedController.createPost);

router.put('/edit', feedController.editPost);

module.exports = router;