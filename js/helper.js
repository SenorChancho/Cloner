/**
 * Created by jimijordan on 2/25/16.
 */
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});

const end_timeout = 5000;

function replaceNewLines(text) {
    text = text.replaceAll('\r\n', '<br>');
    text = text.replaceAll('\r', '<br>');
    text = text.replaceAll('\n', '<br>');

    return text;
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}

function zipFile(path, res, zipPath) {
    var fstream = require('fstream'),
        tar = require('tar'),
        zlib = require('zlib');

    fstream.Reader({ 'path': path, 'type': 'Directory'}) /* Read the source directory */
        .pipe(tar.Pack()) /* Convert the directory to a .tar file */
        .pipe(zlib.Gzip()) /* Compress the .tar file */
        .pipe(fstream.Writer({ 'path': zipPath})); /* Give the output file name */

    setTimeout(deleteFolderRecursive, end_timeout, path);
}

var deleteFolderRecursive = function(path) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file, index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });

        fs.rmdirSync(path);
    }
};

function resizePhoto(src, dest, width, height) {
    imageMagick(src)
        .resize(width, height, '^')
        .gravity('Center')
        .crop(width, height)
        .write(dest, function (err) {
            if (err) console.log(err);
        });
}

function getZipLinks(zipPath, callback) {
    var safeName = "";
    var downloadLinks = "";

    fs.readdir(zipPath, function (err, files) {
        files.forEach(function (file) {
            if (file.indexOf('.tar.gz') > 0) {
                safeName = file.replaceAll('.tar.gz', '');
                downloadLinks += "<li><a href=\'" + file + "\'>" + safeName + "</a></li>";
            }
        });
        callback(downloadLinks);
    });
}

exports.replaceNewLines = replaceNewLines;
exports.findWithAttr = findWithAttr;
exports.zipFile = zipFile;
exports.resizePhoto = resizePhoto;
exports.getZipLinks = getZipLinks;
