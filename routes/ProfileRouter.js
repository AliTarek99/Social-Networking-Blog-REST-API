const express = require('express');
const { check } = require('express-validator');
const profileController = require('../controllers/Profile');
const jwtHelper = require('../util/isAuth');

const router = express.Router();

router.get('/', jwtHelper.isAuth, profileController.getProfile);

router.patch('/edit-profile', jwtHelper.isAuth, profileController.editProfile);

module.exports = router;