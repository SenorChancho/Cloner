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

        helper.resizePhoto(endPathAbout, endPathAbout, 240, 214);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    // Blog photo
    var blogPhotoIndex = helper.findWithAttr(req.files, "fieldname", "blog_photo");
    var endPathBlog = path.join(safeSitePath, 'images', "blog.jpg");

    fs.rename(req.files[blogPhotoIndex].path, endPathBlog, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathBlog, endPathBlog, 240, 214);
        // Delete the temp file
        fs.unlink(req.files[blogPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    // Contact photo
    var contactPhotoIndex = helper.findWithAttr(req.files, "fieldname", "contact_photo");
    var endPathContact = path.join(safeSitePath, 'images', "contact.jpg");

    fs.rename(req.files[contactPhotoIndex].path, endPathContact, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathContact, endPathContact, 240, 214);
        // Delete the temp file
        fs.unlink(req.files[contactPhotoIndex].path, function () {
            if (err) throw err;
        });
    });
}

exports.getUniqueFiles = getUniqueFiles;