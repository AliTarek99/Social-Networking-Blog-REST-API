const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

module.exports = (req, res, next) => {
    if(req.get('Authorzation')) {
        const token = req.get('Authorization').slice(' ')[1];
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
        Users.findById(decodedToken.userId)
        .then(user => {
            if(!user) {
                let error = new Error('Not valid token.');
                error.statusCode = 401;
                throw error;
            }
            req.user = user;
            next();
        }).catch(err => next(err));
    }
}