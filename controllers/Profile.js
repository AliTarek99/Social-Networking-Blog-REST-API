const Users = require('../models/Users');
const fileHelper = require('../util/filesHelper');

exports.getProfile = (req, res, next) => {
    Users.findById(req.userId)
    .then(user => {
        if(!user) {
            let error = new Error('Not Authorized!')
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            status: user.status,
            imageUrl: user.picture
        });
    }).catch(err => next(err));
}

exports.setProfilePic = (req, res, next) => {
    if(req.file){
        return Users.findById(req.userId)
        .then(user => {
            fileHelper.deleteImage(user.picture);
            user.picture = req.file.path;
            return user.save();
        }).then(user => {
            res.status(200).json({
                _id: user._id, 
                name: user.name, 
                email: user.email, 
                status: user.status,
                imageUrl: user.picture
            });
        }).catch(err => console.log(err));
    }
    res.status(200).json({message: 'Nothing changed!'})
}