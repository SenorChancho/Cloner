/**
 * Created by jimijordan on 3/4/16.
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

                helper.resizePhoto(endPath, endPath, 225, 150);
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

        helper.resizePhoto(endPathAbout, endPathAbout, 240, 215);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    for (var i = 1; i < 4; i++) {
        var photoIndex = helper.findWithAttr(req.files, "fieldname", "slide" + i);
        var endPathSlide = path.join(safeSitePath, 'images', "slide" + i + ".jpg");

        (function (photoIndex, endPath) {
            fs.rename(req.files[photoIndex].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 620, 300);
                // Delete the temp file
                fs.unlink(req.files[photoIndex].path, function () {
                    if (err) throw err;
                });
            });
        })(photoIndex, endPathSlide);
    }
}

exports.clone = clone;