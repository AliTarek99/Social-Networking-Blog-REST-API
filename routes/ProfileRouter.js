const express = require('express');
const { check } = require('express-validator');
const profileController = require('../controllers/Profile');
const jwtHelper = require('../util/isAuth');

const router = express.Router();

router.get('/', jwtHelper.isAuth, profileController.getProfile);

router.put('/picture', jwtHelper.isAuth, profileController.setProfilePic);

module.exports = router;