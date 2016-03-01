/**
 * Created by jimijordan on 2/25/16.
 */
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

function getUniqueFiles(req, safeSitePath) {

    // About photo
    var aboutPhotoIndex = helper.findWithAttr(req.files, "fieldname", "about_photo");
    var endPathAbout = path.join(safeSitePath, 'images', "about.jpg");

    fs.rename(req.files[aboutPhotoIndex].path, endPathAbout, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathAbout, endPathAbout, 240, 215);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });
}

exports.getUniqueFiles = getUniqueFiles;