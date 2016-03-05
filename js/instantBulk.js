/**
 * Created by jimijordan on 3/4/16.
 */
var fs = require('fs');
var path = require('path');
var helper = require('./helper');

function getUniqueFiles(req, safeSitePath) {

    for (var i = 1; i < 4; i++) {
        var photoIndex = helper.findWithAttr(req.files, "fieldname", "slide" + i);
        var endPath = path.join(safeSitePath, 'images', "slide" + i + ".jpg");

        (function (photoIndex, endPath) {
            fs.rename(req.files[photoIndex].path, endPath, function (err) {
                if (err) throw err;

                helper.resizePhoto(endPath, endPath, 240, 214);
                // Delete the temp file
                fs.unlink(req.files[photoIndex].path, function () {
                    if (err) throw err;
                });
            });
        })(photoIndex, endPath);
    }
}

exports.getUniqueFiles = getUniqueFiles;