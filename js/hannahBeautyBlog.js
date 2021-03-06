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

                helper.resizePhoto(endPath, endPath, 300, 169);
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

        helper.resizePhoto(endPathAbout, endPathAbout, 950, 620);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    // Cover photo
    var coverPhotoIndex = helper.findWithAttr(req.files, "fieldname", "cover_photo");
    var endPathCover = path.join(safeSitePath, 'images', "cover.jpg");

    fs.rename(req.files[coverPhotoIndex].path, endPathCover, function (err) {
        if (err) throw err;

        helper.resizePhoto(endPathCover, endPathCover, 1109, 568);
        // Delete the temp file
        fs.unlink(req.files[coverPhotoIndex].path, function () {
            if (err) throw err;
        });
    });


}

exports.clone = clone;