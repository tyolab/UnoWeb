/**
 * @file jekyll.js
 */
const yaml = require('yaml');

const fs = require('fs');

const path = require('path');

 function Jekyll (directory) {
    this.directory = directory;
    this.configFile = directory + path.sep + "_config.yml";

    // sub directories
     this.directories = ['_includes', '_i18n', '_data', '_layouts', '_plugins', '_posts', 
    '_sass'];

    this.makeDirectories = function () {
        this.directories.map((folder) => {
            fs.mkdir(directory + path.sep + folder);
        });
    };

    this.initialize = function () {
        var jekyll = this;
        this.directories.map((folder) => {
            jekyll[folder] = directory + path.sep + folder;
        });
    }

    this.isValid = function () {
        return fs.existsSync(this.configFile);
    };

    this.parseConfig = function () {
        const file = fs.readFileSync(this.configFile, 'utf8');
        this.config = yaml.parse(file);
    };

    if (this.isValid())
        this.parseConfig();

    this.initialize();
 }

 Jekyll.prototype.initializeConfig = function (opts) {
    const jekyll = this;
    jekyll.config = jekyll.config || {};
    jekyll.config.source = opts.from;
    jekyll.config.email = opts.email || 'name@exampl.com';
    jekyll.config.title = opts.title || '';
    jekyll.config.destination = opts.to;

    jekyll.config.subtitle = opts.subtitle || '';
    jekyll.config.url = opts.url || '';
    jekyll.config.baseurl = opts.baseurl || '';
    jekyll.config.cover = opts.cover || '';
    jekyll.config.logo = opts.logo || '';

    jekyll.config.markdown = opts.markdown || 'kramdown';

    jekyll.config.source = opts.source || '';
    jekyll.config.destination = opts.destination || '';

    if (jekyll.config.sass_dir) {
        jekyll.config.sass = jekyll.config.sass || {};
        jekyll.config.sass.sass_dir = jekyll.config.sass_dir;
    }
 }

 Jekyll.prototype.build = function ($, fileName) {
    const jekyll = this;
    fileName = fileName || "";
     // write all elements

     // write layout
     

     // write head
    var headStr = $('head').html();
    fs.writeFileSync(jekyll._includes + path.sep + "head.html", headStr);

     // write body
     var bodyStr = `
        ---
        layout: page
        title: ${jekyll.config.title}
        permalink: /${fileName}
        ---

     `;

    // write header
    var headerElem = $('header');
    if (headerElem.length) {
        var headerStr = headerElem.html();
        fs.writeFileSync(jekyll._includes + path.sep + "header.html", headerStr);
        $('header').remove();
    }

     // write footer
     var footerElem = $('footer');
     if (footerElem.length) {
         var footerStr = footerElem.html();
         fs.writeFileSync(jekyll._includes + path.sep + "footer.html", footerStr);

         $('footer').remove();
     }

     bodyStr += $('body').html();
     fs.writeFileSync(this.directory + path.sep + fileName, bodyStr);

 }

 module.exports = Jekyll;