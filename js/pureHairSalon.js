/**
 * Created by jimijordan on 2/25/16.
 */
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

function clone(req, safeSitePath) {
    // Article photos
    var articleCount = helper.getNumberOfArticles(req);
    for (var index = 1; index <= articleCount; index++) {
        var endPath = path.join(safeSitePath, 'images', helper.getFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathog = path.join(safeSitePath, 'images', "og" + helper.getFileName(req, 'blog' + index.toString() + '.html') + ".jpg");

        var fieldName = "article" + index.toString() + "_photo";
        var fieldNameIndex = helper.findWithAttr(req.files, "fieldname", fieldName);
        (function (endPath, endPathog, i) {

            console.log(req.files);
            fs.rename(req.files[i].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 225, 225);
                helper.resizePhoto(endPath, endPathog, 1200, 1200);
                // Delete the temp file
                fs.unlink(req.files[i].path, function () {
                    if (err) throw err;
                });
            });
        })(endPath, endPathog, fieldNameIndex);
    }

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

exports.clone = clone;