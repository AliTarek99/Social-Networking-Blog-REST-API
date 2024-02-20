const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const crypto = require('crypto');


//mailjet apikeys
const apiKey = '45dc56f3e085146993094f22023a73d5', secretKey = '07ef04d6ad49ccb2e99edd04027bd837';
const mailjet = require('node-mailjet')
    .apiConnect(apiKey, secretKey);

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
    if(!err.isEmpty()) {
        let error = new Error('Validation Error');
        error.statusCode = 422;
        error.data = err.array();
        throw error;
    }
    let user = new Users();
    user.email = req.body.email;
    user.name = req.body.name;
    user.status = req.body.status || "";
    bcrypt.hash(req.body.password, 12)
    .then(value => {
        user.password = value;
        
        return user.save();
    }).then(result => {
        crypto.randomBytes(32, (err, buff) => {
            if(err) {
                throw err;
            }
            buff = buff.toString('hex');
            user.verificationToken = buff;
            user.save();
            sendEmail({
                subject: "Email verification.",
                text: "Click here to verify your email.",
                html: `<p>Click <a href="${req.protocol}://${req.get('host')}/auth/verify/${buff}">here</a> to verify your email.</p>`
            }, {
                email: user.email,
                name: user.name
            });
        });
        res.status(201).json({ message: 'User created!', userId: result._id });
    }).catch(err => next(err));
}

exports.verifyEmail = (req, res, next) => {
    Users.findOne({verificationToken: req.params.token})
    .then(user => {
        if(!user) {
            let error = new Error('Page not found!')
            error.statusCode = 404;
            throw error;
        }
        user.verificationToken = undefined;
        return user.save()
    }).then(() => res.status(200).json({message: 'Account has been verified!'}))
    .catch(err => next(err));
}

exports.passResetEmail = (req, res, next) => {
    Users.findOne({email: req.body.email})
    .then(user => {
        res.status(200).json({message: 'If email exists you will receive an email with password change link.'});
        if(user && !user.verificationToken) {
            crypto.randomBytes(32, (err, buff) => {
                if(err) {
                    throw err;
                }
                buff = buff.toString('hex');
                user.passResetToken = buff;
                user.resetExpiry = Date.now() + 3600000;
                user.save();
                sendEmail({
                    subject: "Password reset.",
                    text: "If you requested to reset your password click here and if it was not you just ignore this email.\n" +
                        "Note: this link expires after an hour.",
                    html: `<p>If you requested to reset your password click <a href="${req.protocol}://${req.get('host')}/auth/change-password/${buff}">here</a> 
                        and if it was not you just ignore this email. Note: this link expires after an hour.</p>`
                }, {
                    email: user.email,
                    name: user.name
                });
            });
        }
    }).catch(err => console.log(err));
}

exports.checkPassToken = (req, res, next) => {
    Users.findOne({passResetToken: req.params.token, resetExpiry: {$gt: new Date()}})
    .then(user => {
        if(!user) {
            let error = new Error('Page not found!');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({verified: true});
    }).catch(err => next(err));
}

exports.editPassword = (req, res, next) => {
    Users.findOne({passResetToken: req.params.token, resetExpiry: {$gt: new Date()}})
    .then(user => {
        if(!user) {
            let error = new Error('Page not found!');
            error.statusCode = 404;
            throw error;
        }
        return bcrypt.hash(req.body.password, 12)
        .then(hash => {
            user.password = hash;
            return user.save();
        })
    }).then(user => {
        res.status(200).json({message: 'Password changed successfully.'});
        crypto.randomBytes(32, (err, buff) => {
            if(err)
                throw err;
            user.passResetToken = buff.toString('hex');
            user.resetExpiry = Date.now() + 3600000;
            user.save();
            sendEmail({
                subject: "Password changed!",
                text: "Password changed successfully. if it was not you click here to change the password.\n This link expires after 1 hour",
                html: `<p>Password changed successfully. if it was not you click <a href="${req.protocol}://${req.get('host')}/auth/change-password/${buff}">here</a> to change the password.
                    This link expires after 1 hour.</p>`
            }, {
                email: user.email,
                name: user.name
            });
        })
    }).catch(err => {
        if(err.statusCode)
            next(err);
        console.log(err);
    });
}

const sendEmail = (message, to) => {
    mailjet
    .post('send', {version: 'v3.1'})
    .request({
        Messages: [
            {
                From: {
                    Email: "alitarek5120@gmail.com",
                    Name: "Blog Post"
                },
                To: [
                    {
                        Email: to.email,
                        Name: to.name
                    }
                ],
                Subject: message.subject,
                TextPart: message.text,
                HtmlPart: message.html
            }
        ]
    }).then(result => {
        console.log(result.body);
    }).catch(err => console.log(err));
}