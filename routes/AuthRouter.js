const authController = require('../controllers/Auth');
const express = require('express');
const { check } = require('express-validator');
const Users = require('../models/Users');

const router = express.Router();

router.post('/login', authController.login);

router.put('/signup', [
    check('email').isEmail().withMessage('Not a valid email'),
    check('password').trim().isLength({min: 5}).withMessage('Password has to be at least 5 charaters'),
    check('email').custom(value => {
        return Users.findOne({email: value})
        .then(user => {
            if(user) 
                return Promise.reject('Email address is already used.');
        })
    }),
    check('name').trim().notEmpty()
], authController.signup);

module.exports = router;