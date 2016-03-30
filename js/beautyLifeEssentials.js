/**
 * Created by jimijordan on 3/4/16.
 */
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

function getUniqueFiles(req, safeSitePath) {

    // Article photos
    var articleCount = helper.getNumberOfArticles(req);
    for (var index = 1; index <= articleCount; index++) {
        var endPath = path.join(safeSitePath, 'images', helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathog = path.join(safeSitePath, 'images', "og" + helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathThumb = path.join(safeSitePath, 'images', helper.getArticleFileName(req, 'blog' + index.toString() + '.html') + "_thumb" + ".jpg");

        var fieldName = "article" + index.toString() + "_photo";
        var fieldNameIndex = helper.findWithAttr(req.files, "fieldname", fieldName);
        (function(endPath, endPathog, endPathThumb, i) {

            console.log(req.files);
            fs.rename(req.files[i].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 756, 396);
                helper.resizePhoto(endPath, endPathog, 1200, 1200);
                helper.resizePhoto(endPath, endPathThumb, 74, 74);

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

        helper.resizePhoto(endPathAbout, endPathAbout, 600, 600);
        // Delete the temp file
        fs.unlink(req.files[aboutPhotoIndex].path, function () {
            if (err) throw err;
        });
    });

    //for (var i = 1; i < 4; i++) {
    //    var photoIndex = helper.findWithAttr(req.files, "fieldname", "slide" + i);
    //    var endPath = path.join(safeSitePath, 'images', "slide" + i + ".jpg");
    //
    //    (function (photoIndex, endPath) {
    //        fs.rename(req.files[photoIndex].path, endPath, function (err) {
    //            if (err) throw err;
    //
    //            helper.resizePhoto(endPath, endPath, 620, 300);
    //            // Delete the temp file
    //            fs.unlink(req.files[photoIndex].path, function () {
    //                if (err) throw err;
    //            });
    //        });
    //    })(photoIndex, endPath);
    //}


}

exports.clone = getUniqueFiles;