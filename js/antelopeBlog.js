/**
 * Created by jimijordan on 4/19/16.
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

                helper.resizePhoto(endPath, endPath, 800, 450);
                helper.resizePhoto(endPath, endPathog, 1200, 1200);
                helper.resizePhoto(endPath, endPathThumb, 800, 350);
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

        helper.resizePhoto(endPathAbout, endPathAbout, 1200, 600);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

}

exports.clone = clone;