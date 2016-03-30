/**
 * Created by jimijordan on 2/25/16.
 */
var fs = require('fs');
var path = require('path');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});
var badWords = ["the", "of", "a", "an", "on", "to", "this", "that", "skin", "hair", "muscle", "muscles", "nail", "nails", "fitness", "weight", "beauty", "fat"];

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

function getArticleFileName(req, oldName) {
    if (oldName === "blog1.html" || oldName === "blog2.html" || oldName === "blog3.html") {
        var newFileName = "";

        if (oldName === "blog1.html") {
            newFileName = req.body.article1_title;
        }
        else if (oldName === "blog2.html") {
            newFileName = req.body.article2_title;
        }
        else {
            newFileName = req.body.article3_title;
        }
        newFileName = newFileName.toLowerCase();
        var fileWords = newFileName.split(' ');
        fileWords = fileWords.filter(function(x) { return badWords.indexOf(x) < 0});
        newFileName = fileWords.join(' ');
        newFileName = newFileName.replace(/[^\w\s]/gi, '');
        newFileName = newFileName.toCamelCase();
        newFileName = newFileName.trim();

        return newFileName;
    }

    return oldName.replace('.html', '');
}

function getFileName(req, oldName) {
    if (oldName === "blog1.html" || oldName === "blog2.html" || oldName === "blog3.html" || oldName === "blog4.html" || oldName === "blog5.html") {
        var newFileName = "";

        if (oldName === "blog1.html") {
            newFileName = req.body.article1_title;
        }
        else if (oldName === "blog2.html") {
            newFileName = req.body.article2_title;
        }
        else if (oldName === "blog3.html") {
            newFileName = req.body.article3_title;
        }
        else if (oldName === "blog4.html") {
            newFileName = req.body.article4_title;
        }
        else if (oldName === "blog5.html") {
            newFileName = req.body.article5_title;
        }

        newFileName = newFileName.toLowerCase();
        var fileWords = newFileName.split(' ');
        fileWords = fileWords.filter(function(x) { return badWords.indexOf(x) < 0});
        newFileName = fileWords.join(' ');
        newFileName = newFileName.replace(/[^\w\s]/gi, '');
        newFileName = newFileName.toCamelCase();
        newFileName = newFileName.trim();

        return newFileName;
    }

    return oldName.replace('.html', '');
}

function getNumberOfArticles(req) {
    if(req.body.article5.toString() !== "") {
        return 5;
    }
    if(req.body.article4.toString() !== "") {
        return 4;
    }

    return 3;

}

exports.replaceNewLines = replaceNewLines;
exports.findWithAttr = findWithAttr;
exports.zipFile = zipFile;
exports.resizePhoto = resizePhoto;
exports.getZipLinks = getZipLinks;
exports.getArticleFileName = getArticleFileName;
exports.getFileName = getFileName;
exports.getNumberOfArticles = getNumberOfArticles;
