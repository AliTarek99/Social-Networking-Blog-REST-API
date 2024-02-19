const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

exports.isAuth = (req, res, next) => {
    if(req.get('Authorization')) {
        const token = req.get('Authorization').split(' ')[1];
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, '12jijja9s204qwepoi129gsn');
        }catch(err) {
            throw err;
        }
        if(!decodedToken) {
            let error = new Error('Not valid token.');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    }
}

exports.decode = req => {
    if(req.get('Authorization')) {
        const token = req.get('Authorization').split(' ')[1];
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, '12jijja9s204qwepoi129gsn');
        }catch(err) {
            return undefined;
        }
        return req.userId = decodedToken.userId;
    }
}