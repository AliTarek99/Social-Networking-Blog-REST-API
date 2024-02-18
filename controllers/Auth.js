const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');

exports.login = (req, res, next) => {
    let tmp;
    Users.findOne({ email: req.body.email })
    .then(user => {
        if(!user)
            throw new Error('Wrong email or password');
        tmp = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if(result) {
            let token = jwt.sign({ userId: tmp._id }, '12jijja9s204qwepoi129gsn', {expiresIn: '1h'});
            return res.status(200).json({ token: token, userId: tmp._id.toString() });
        }
        let error = new Error('Wrong email or password');
        error.statusCode = 401;
        throw err;
    }).catch(err => next(err));
};

exports.signup = (req, res, next) => {
    let err = validationResult(req);
    if(!err.isEmpty) {
        let error = new Error('Validation Error');
        error.statusCode = 422;
        error.data = err.array();
        throw error;
    }
    let user = new Users();
    user.email = req.body.email;
    user.name = req.body.name;
    if(req.file)
        user.picture = req.file.path;
    bcrypt.hash(req.body.password, 12)
    .then(value => {
        user.password = value;
        return user.save();
    }).catch(err => next(err));
}