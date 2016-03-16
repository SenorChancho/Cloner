/**
 * Created by jimijordan on 3/4/16.
 */
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

function getUniqueFiles(req, safeSitePath) {
    for (var index = 1; index <= 3; index++) {
        var endPath = path.join(safeSitePath, 'images', helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathog = path.join(safeSitePath, 'images', "og" + helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathThumb = path.join(safeSitePath, 'images', helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + "_thumb" + ".jpg");

        var fieldName = "article" + index.toString() + "_photo";
        var fieldNameIndex = helper.findWithAttr(req.files, "fieldname", fieldName);
        (function (endPath, endPathog, endPathThumb, i) {

            console.log(req.files);
            fs.rename(req.files[i].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 1920, 1280);
                helper.resizePhoto(endPath, endPathog, 1200, 1200);

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

        helper.resizePhoto(endPathAbout, endPathAbout, 284, 174);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });
}

exports.getUniqueFiles = getUniqueFiles;