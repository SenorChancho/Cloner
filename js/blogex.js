/**
 * Created by jimijordan on 4/1/16.
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
        var endPathThumb = path.join(safeSitePath, 'images', helper.getFileName(req, 'blog' + index.toString() + '.html') + "_thumb" + ".jpg");

        var fieldName = "article" + index.toString() + "_photo";
        var fieldNameIndex = helper.findWithAttr(req.files, "fieldname", fieldName);
        (function(endPath, endPathog, endPathThumb, i) {

            console.log(req.files);
            fs.rename(req.files[i].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 1000, 714);
                helper.resizePhoto(endPath, endPathog, 1200, 1200);
                helper.resizePhoto(endPath, endPathThumb, 415, 282);
                // Delete the temp file
                fs.unlink(req.files[i].path, function () {
                    if (err) throw err;
                });
            });
        })(endPath, endPathog, endPathThumb, fieldNameIndex);
    }

    // About photo
    var aboutPhotoIndex = helper.findWithAttr(req.files, "fieldname", "about_photo");
    var endPathAbout = path.join(safeSitePath, 'images', "about.jpg");

    fs.rename(req.files[aboutPhotoIndex].path, endPathAbout, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathAbout, endPathAbout, 980, 522);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    // Contact photo
    var contactPhotoIndex = helper.findWithAttr(req.files, "fieldname", "contact_photo");
    var endPathContact = path.join(safeSitePath, 'images', "contact.jpg");

    fs.rename(req.files[contactPhotoIndex].path, endPathContact, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathContact, endPathContact, 977, 520);
        // Delete the temp file
        fs.unlink(req.files[contactPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    // Action photo
    var actionPhotoIndex = helper.findWithAttr(req.files, "fieldname", "action_photo");
    var endPathAction = path.join(safeSitePath, 'images', "signup.jpg");

    fs.rename(req.files[actionPhotoIndex].path, endPathAction, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathAction, endPathAction, 415, 282);
        // Delete the temp file
        fs.unlink(req.files[actionPhotoIndex].path, function () {
            if (err) throw err;
        });
    });
}
exports.clone = clone;