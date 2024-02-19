const fs = require('fs');

exports.deleteImage = url => {
    if(url)
        fs.rm(url, err => console.log(err? err: ""));
}