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
var instantBulk = require('./instantBulk.js');
var terraHairDesign = require('./terraHairDesign.js');
var beautyLifeEssentials = require('./beautyLifeEssentials.js');
var scienceOfAthletics = require('./scienceOfAthletics.js');
var hannahBeautyBlog = require('./hannahBeautyBlog.js');
var strongEvo = require('./strongEvo.js');

const end_timeout = 5000;

const articleCount = 3;
const articlePreviewCount = 75;
const aboutPreviewCount = 10;
var badWords = ["the", "of", "a", "an", "on", "to", "this", "that", "skin", "hair", "muscle", "muscles", "nail", "nails", "fitness", "weight", "beauty", "fat", "fit", "exercise"];
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

    helper.getZipLinks('./public/', function (downloadLinks) {
        res.write(html.replace('{{downloadLink}}', downloadLinks));
        res.end();
    });
});

app.post('/clear', function(req, res) {
    console.log('clear function called');
    fs.readdir('./public/', function (err, files) {

        files.forEach(function (file) {
            if (file.indexOf('.tar.gz') > 0) {
                fs.unlink(path.join('./public/', file), function () {
                    if (err) throw err;
                });
            }
        });
        var html = fs.readFileSync("./index.html", "UTF-8");
        res.write(html.replace('{{downloadLink}}', ''));
        res.end();
    });
});

app.post('/', function(req, res) {
    var templatePath = path.join("./templates", req.body.templateType);
    var safeSitePath = path.join("./", req.body.safe_site_name);
    fs.mkdirSync(safeSitePath);
    fs.mkdirSync(path.join(safeSitePath, "images"));

    fs.readdir(templatePath, function(err, files) {
        files.forEach(function(item) {
            if (item.indexOf('.html') > -1 || item.indexOf('.css') > -1) {
                var fileText = fs.readFileSync(path.join(templatePath, item), "UTF-8");

                // Title and OG Data
                fileText = fileText.replaceAll('{{title}}', req.body.safe_site_name);
                fileText = fileText.replaceAll('{{title_no_spaces}}', req.body.safe_site_name.replaceAll(' ', ''));

                // Blog author
                fileText = fileText.replaceAll('{{writer}}', req.body.writer_name);

                // About
                var aboutText = req.body.about.replaceAll('{{title}}', req.body.safe_site_name);
                aboutText = aboutText.replaceAll('{{writer}}', req.body.writer_name);
                fileText = fileText.replaceAll('{{about}}', helper.replaceNewLines(aboutText));

                // Articles and article previews
                fileText = fileText.replaceAll('{{article1_title}}', req.body.article1_title);
                fileText = fileText.replaceAll('{{article1}}', helper.replaceNewLines(req.body.article1));
                fileText = fileText.replaceAll('{{article1_preview}}', createPreview(helper.replaceNewLines(req.body.article1), articlePreviewCount));

                fileText = fileText.replaceAll('{{article2_title}}', req.body.article2_title);
                fileText = fileText.replaceAll('{{article2}}', helper.replaceNewLines(req.body.article2));
                fileText = fileText.replaceAll('{{article2_preview}}', createPreview(helper.replaceNewLines(req.body.article2), articlePreviewCount));

                fileText = fileText.replaceAll('{{article3_title}}', req.body.article3_title);
                fileText = fileText.replaceAll('{{article3}}', helper.replaceNewLines(req.body.article3));
                fileText = fileText.replaceAll('{{article3_preview}}', createPreview(helper.replaceNewLines(req.body.article3), articlePreviewCount));

                fileText = fileText.replaceAll('{{article4_title}}', req.body.article4_title);
                fileText = fileText.replaceAll('{{article4}}', helper.replaceNewLines(req.body.article4));
                fileText = fileText.replaceAll('{{article4_preview}}', createPreview(helper.replaceNewLines(req.body.article4), articlePreviewCount));

                fileText = fileText.replaceAll('{{article5_title}}', req.body.article5_title);
                fileText = fileText.replaceAll('{{article5}}', helper.replaceNewLines(req.body.article5));
                fileText = fileText.replaceAll('{{article5_preview}}', createPreview(helper.replaceNewLines(req.body.article5), articlePreviewCount));

                // Action phrase
                fileText = fileText.replaceAll('{{action}}', req.body.action_phrase);

                // Contact
                fileText = fileText.replaceAll('{{contact}}', req.body.contact);

                // Quote
                fileText = fileText.replaceAll('{{quote}}', req.body.quote);

                // Misc
                fileText = fileText.replaceAll('{{who_we_are}}', req.body.who_we_are);
                fileText = fileText.replaceAll('{{what_we_do}}', req.body.what_we_do);
                fileText = fileText.replaceAll('{{stay_in_touch}}', req.body.stay_in_touch);
                fileText = fileText.replaceAll('{{welcome}}', req.body.welcome);
                fileText = fileText.replaceAll('{{slide1_caption}}', req.body.caption1);
                fileText = fileText.replaceAll('{{slide2_caption}}', req.body.caption2);
                fileText = fileText.replaceAll('{{slide3_caption}}', req.body.caption3);
                fileText = fileText.replaceAll('{{about_preview}}', createPreview(helper.replaceNewLines(aboutText), aboutPreviewCount));


                // Replace file names
                fileText = fileText.replaceAll('blog1', helper.getFileName(req, "blog1.html"));
                fileText = fileText.replaceAll('blog2', helper.getFileName(req, "blog2.html"));
                fileText = fileText.replaceAll('blog3', helper.getFileName(req, "blog3.html"));
                fileText = fileText.replaceAll('blog4', helper.getFileName(req, "blog4.html"));
                fileText = fileText.replaceAll('blog5', helper.getFileName(req, "blog5.html"));

                // Write file to directory
                if (item.indexOf('.html') > -1) {
                    fs.writeFile(path.join(safeSitePath, helper.getFileName(req, item) + ".html"), fileText);
                }
                else {
                    fs.writeFile(path.join(safeSitePath, item), fileText);
                }
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

    // Template specific files
    var templateType = req.body.templateType.toString().replace(new RegExp("[0-9]", "g"), "");

    switch (templateType) {
        case "Strong Evo":
            strongEvo.clone(req, safeSitePath);
            break;
        case "Challenger Fit Blog":
            challengerFitBlog.clone(req, safeSitePath);
            break;
        case "Pure Hair Salon":
            pureHairSalon.clone(req, safeSitePath);
            break;
        case "Life and Beauty":
            lifeAndBeauty.clone(req, safeSitePath);
            break;
        case "Instant Bulk":
            instantBulk.clone(req, safeSitePath);
            break;
        case "Terra Hair Design":
            terraHairDesign.clone(req, safeSitePath);
            break;
        case "Beauty Life Essentials":
            beautyLifeEssentials.clone(req, safeSitePath);
            break;
        case "Science of Athletics":
            scienceOfAthletics.clone(req, safeSitePath);
            break;
        case "Hannah's Beauty Blog":
            hannahBeautyBlog.clone(req, safeSitePath);
            break;
        default:
            break;
    }

    var safeName = req.body.safe_site_name;
    var relZipPath = "./public/" + safeName + ".tar.gz";
    var fileName = safeName + ".tar.gz";
    var downloadLink = "<li><a href=\'" + fileName + "\'>" + safeName + "</a></li>";
    var html = fs.readFileSync("./index.html", "UTF-8");

    helper.getZipLinks('./public/', function (downloadLinks) {
        downloadLink += downloadLinks;
        res.write(html.replace('{{downloadLink}}', downloadLink));
        res.end();
    });

    setTimeout(helper.zipFile, end_timeout, safeSitePath, res, relZipPath);
});

app.listen(port, function() {

});

function createPreview(entry, previewCount) {
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

//function helper.getFileName(req, oldName) {
//    if (oldName === "blog1.html" || oldName === "blog2.html" || oldName === "blog3.html") {
//        var newFileName = "";
//
//        if (oldName === "blog1.html") {
//            newFileName = req.body.article1_title;
//        }
//        else if (oldName === "blog2.html") {
//            newFileName = req.body.article2_title;
//        }
//        else {
//            newFileName = req.body.article3_title;
//        }
//        newFileName = newFileName.toLowerCase();
//        var fileWords = newFileName.split(' ');
//        fileWords = fileWords.filter(function(x) { return badWords.indexOf(x) < 0});
//        newFileName = fileWords.join(' ');
//        newFileName = newFileName.replace(/[^\w\s]/gi, '');
//        newFileName = newFileName.toCamelCase();
//        newFileName = newFileName.trim();
//
//        return newFileName;
//    }
//
//    return oldName.replace('.html', '');
//}

//function reSizePhoto(template, src, dest) {
//    // Resize to template size
//    var width = 0;
//    var height = 0;
//
//    switch (template) {
//        case "Strong Evo":
//            width = 225;
//            height = 154;
//            break;
//        case "Pure Hair Salon":
//            width = 225;
//            height = 225;
//            break;
//        case "Life and Beauty":
//            width = 250;
//            height = 160;
//            break;
//        case "Challenger Fit Blog":
//            width = 250;
//            height = 250;
//            break;
//        case "Instant Bulk":
//            width = 225;
//            height = 150;
//            break;
//        case "Terra Hair Design":
//            width = 175;
//            height = 200;
//            break;
//        default:
//            break;
//    }
//    imageMagick(src)
//        .resize(width, height, '^')
//        .gravity('Center')
//        .crop(width, height)
//
//        .write(src, function (err) {
//            if (err) console.log(err);
//            else {
//                // Make OG copy
//                imageMagick(src)
//                    .resize(1200, 1200, '^')
//                    .autoOrient()
//                    .write(dest, function (err) {
//                        if (err) console.log(err);
//                    });
//            }
//        });
//}
