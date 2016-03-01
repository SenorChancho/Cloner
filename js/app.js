var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require("fs");
var multer = require('multer');
var app = express();
var ncp = require('ncp');
var gm = require('gm');
var imageMagick = gm.subClass({imageMagick: true});
var chokidar = require('chokidar');

var helper = require('./helper.js');
var challengerFitBlog = require('./challengerFitBlog.js');
var pureHairSalon = require('./pureHairSalon.js');
var lifeAndBeauty = require('./lifeAndBeauty.js');

const end_timeout = 5000;

const articleCount = 3;
const previewCount = 75;
var badWords = ["the", "of", "a", "an", "on", "to", "this", "that", "skin", "hair", "muscle", "muscles", "nail", "nails", "fitness", "weight", "beauty"];
var port = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(express.static('./public'));
app.use('/images',express.static(path.join(__dirname, 'public/images')));
app.use('/templates',express.static(path.join(__dirname, 'public/templates')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use(multer({ dest: './uploads/'}).any());

app.get('/', function(req, res) {
    var html = fs.readFileSync("./index.html", "UTF-8");

    var safeName = "";
    var relZipPath = "";
    var fileName = "";
    var downloadLinks = "";

    fs.readdir('./public/', function (err, files) {
        files.forEach(function (file) {
            if (file.indexOf('.tar.gz') > 0) {
                safeName = file.replaceAll('.tar.gz', '');
                downloadLinks += "<li><a href=\'" + file + "\'>" + safeName + "</a></li>";
            }
        });

        res.write(html.replace('{{downloadLink}}', downloadLinks));
        res.end();
    });


});

app.post('/clear', function(req, res) {
    fs.readdir('./public/', function (err, files) {
        files.forEach(function (file) {
            if (file.indexOf('.tar.gz') > 0) {
                fs.unlink(path.join('./public/', file), function () {
                    if (err) throw err;
                });
            }
        });
    });
});

app.post('/', function(req, res) {
    var templatePath = path.join("./templates", req.body.templateType);
    var safeSitePath = path.join("./", req.body.safe_site_name);
    fs.mkdirSync(safeSitePath);
    fs.mkdirSync(path.join(safeSitePath, "images"));

    fs.readdir(templatePath, function(err, files) {
        files.forEach(function(item) {
            if (item.indexOf('.html') > -1) {
                var htmlText = fs.readFileSync(path.join(templatePath, item), "UTF-8");

                // Title and OG Data
                htmlText = htmlText.replaceAll('{{title}}', req.body.safe_site_name);
                htmlText = htmlText.replaceAll('{{title_no_spaces}}', req.body.safe_site_name.replaceAll(' ', ''));

                // Blog author
                htmlText = htmlText.replaceAll('{{writer}}', req.body.writer_name);

                // About
                var aboutText = req.body.about.replaceAll('{{title}}', req.body.safe_site_name);
                aboutText = aboutText.replaceAll('{{writer}}', req.body.writer_name);
                htmlText = htmlText.replaceAll('{{about}}', helper.replaceNewLines(aboutText));

                // Articles and article previews
                htmlText = htmlText.replaceAll('{{article1_title}}', req.body.article1_title);
                htmlText = htmlText.replaceAll('{{article1}}', helper.replaceNewLines(req.body.article1));
                htmlText = htmlText.replaceAll('{{article1_preview}}', createPreview(helper.replaceNewLines(req.body.article1)));

                htmlText = htmlText.replaceAll('{{article2_title}}', req.body.article2_title);
                htmlText = htmlText.replaceAll('{{article2}}', helper.replaceNewLines(req.body.article2));
                htmlText = htmlText.replaceAll('{{article2_preview}}', createPreview(helper.replaceNewLines(req.body.article2)));

                htmlText = htmlText.replaceAll('{{article3_title}}', req.body.article3_title);
                htmlText = htmlText.replaceAll('{{article3}}', helper.replaceNewLines(req.body.article3));
                htmlText = htmlText.replaceAll('{{article3_preview}}', createPreview(helper.replaceNewLines(req.body.article3)));

                // Action phrase
                htmlText = htmlText.replaceAll('{{action}}', req.body.action_phrase);

                // Contact
                htmlText = htmlText.replaceAll('{{contact}}', req.body.contact);

                // Quote
                htmlText = htmlText.replaceAll('{{quote}}', req.body.quote);

                // Misc
                htmlText = htmlText.replaceAll('{{who_we_are}}', req.body.who_we_are);
                htmlText = htmlText.replaceAll('{{what_we_do}}', req.body.what_we_do);
                htmlText = htmlText.replaceAll('{{stay_in_touch}}', req.body.stay_in_touch);

                // Replace file names
                htmlText = htmlText.replaceAll('blog1', getFileName(req, "blog1.html"));
                htmlText = htmlText.replaceAll('blog2', getFileName(req, "blog2.html"));
                htmlText = htmlText.replaceAll('blog3', getFileName(req, "blog3.html"));

                // Write file to directory
                fs.writeFile(path.join(safeSitePath, getFileName(req, item) + ".html"), htmlText);
            }
            else {
                // Copy rest of files
                ncp(path.join(templatePath, item), path.join(safeSitePath, item));
            }
        });
    });

    // Copy Logo
    fs.rename(req.files[0].path, path.join(safeSitePath, 'images', "logo.png"), function(err) {
        if (err) throw err;

        // Delete the temp file
        fs.unlink(req.files[0].path, function() {
            if (err) throw err;
        });
    });

    // Article photos
    for (var index = 1; index <= articleCount; index++) {
        var endPath = path.join(safeSitePath, 'images', getFileName(req, 'blog' + index.toString() + '.html') + ".jpg");
        var endPathog = path.join(safeSitePath, 'images', "og" + getFileName(req, 'blog' + index.toString() + '.html') + ".jpg");

        var fieldName = "article" + index.toString() + "_photo";
        var fieldNameIndex = helper.findWithAttr(req.files, "fieldname", fieldName);
        (function(endPath, endPathog, i) {

            console.log(req.files);
            fs.rename(req.files[i].path, endPath, function (err) {
                if (err) throw err;

                reSizePhoto(req.body.templateType, endPath, endPathog);
                // Delete the temp file
                fs.unlink(req.files[i].path, function () {
                    if (err) throw err;
                });
            });
        })(endPath, endPathog, fieldNameIndex);
    }

    // Template specific files
    switch (req.body.templateType) {
        case "Challenger Fit Blog":
            challengerFitBlog.getUniqueFiles(req, safeSitePath);
            break;
        case "Pure Hair Salon":
            pureHairSalon.getUniqueFiles(req, safeSitePath);
            break;
        case "Life and Beauty":
            lifeAndBeauty.getUniqueFiles(req, safeSitePath);
            break;
        default:
            break;
    }

    var safeName = req.body.safe_site_name;
    var relZipPath = "./public/" + safeName + ".tar.gz";
    var fileName = safeName + ".tar.gz";
    var downloadLink = "<li><a href=\'" + fileName + "\'>" + safeName + "</a></li>";

    fs.readdir('./public/', function (err, files) {
       files.forEach(function (file) {
        if (file.indexOf('.tar.gz') > 0) {
            safeName = file.replaceAll('.tar.gz', '');
            downloadLink += "<li><a href=\'" + file + "\'>" + safeName + "</a></li>";
        }
       })
    });

    setTimeout(helper.zipFile, end_timeout, safeSitePath, res, relZipPath, downloadLink);

    var html = fs.readFileSync("./index.html", "UTF-8");

    html = html.replace('{{downloadLink}}', "");
    res.write(html);
});

app.listen(port, function() {

});

function createPreview(entry) {
    var words = entry.split(' ');
    var preview = "";

    for (var i = 0; i < previewCount; i++) {
        preview += words[i] + " ";
    }

    return preview;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.toCamelCase = function() {
    return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};

Array.prototype.last = function() {
    return this[this.length - 1];
};

function getFileName(req, oldName) {
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

        return newFileName;
    }

    return oldName.replace('.html', '');
}

function resizePhoto(src, dest, width, height) {
    gm(src)
        .resize(width, height, '^')
        .gravity('Center')
        .crop(width, height)
        .write(dest, function (err) {
            if (err) console.log(err);
            });
}

function reSizePhoto(template, src, dest) {
    // Resize to template size
    var width = 0;
    var height = 0;

    switch (template) {
        case "Strong Evo":
            width = 225;
            height = 154;
            break;
        case "Pure Hair Salon":
            width = 225;
            height = 225;
            break;
        case "Life and Beauty":
            width = 250;
            height = 160;
            break;
        case "Challenger Fit Blog":
            width = 250;
            height = 250;
            break;
        default:
            break;
    }
    imageMagick(src)
        .resize(width, height, '^')
        .gravity('Center')
        .crop(width, height)

        .write(src, function (err) {
            if (err) console.log(err);
            else {
                // Make OG copy
                imageMagick(src)
                    .resize(1200, 1200, '^')
                    .autoOrient()
                    .write(dest, function (err) {
                        if (err) console.log(err);
                    });
            }
        });
}
