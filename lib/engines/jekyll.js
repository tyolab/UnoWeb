/**
 * @file jekyll.js
 */
const yaml = require('yaml');

const fs = require('fs');

const util = require('util');

const path = require('path');

const Engine = require('./engine');

const crypto = require('crypto');

 function Jekyll (target_directory) {

    Engine.call(this, target_directory);

    this.configFile = target_directory + path.sep + "_config.yml";

    // sub directories
     this.directories = ['_includes', '_i18n', '_data', '_layouts', '_plugins', '_posts', 
    '_sass'];

    this.makeDirectories = function () {
        this.directories.map((folder) => {
            var dirname = target_directory + path.sep + folder;
            fs.mkdir(dirname, (err) => {
                console.log("Folder: " + dirname + (!err ? "" : "not ") + " created.")
            });
        });
    };

    this.initialize = function (opts) {
        var jekyll = this;
        this.directories.map((folder) => {
            jekyll[folder] = target_directory + path.sep + folder;
        });

        jekyll.initializeConfig(opts);

        // create all the necessary folders
        jekyll.makeDirectories();
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
     var bodyStr = 
`---
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

     var $body = $('body');
     var $sections = $('section', $body);
     if ($sections.length) {
        var names = fileName.split('.');
        var name = names[0];

        var namePath = jekyll._includes + path.sep + name;

        try {
        if (!fs.existsSync(namePath))
            fs.mkdirSync(namePath);
        else {
            fs.readdir(namePath, (err, files) => {
                if (err) throw err;
              
                for (const file of files) {
                  fs.unlink(path.join(namePath, file), err => {
                    if (err) throw err;
                  });
                }
              });
        }
        }
        catch (err) {
            console.error(err);
        }

         $sections.map((index, section) => {
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var hash = crypto.createHash('sha1').update(current_date + random).digest('hex').substr(0, 5);

            var sectionStr = $(section).clone().wrap("<div/>").parent().html();

            var sectionName = 'section-' + hash + ".html";

            bodyStr += `
            {% include ${name}/${sectionName} %}
            `

            fs.writeFileSync(namePath + path.sep + sectionName, sectionStr);
         });


     }
     else {
        bodyStr += bodyElem.html();
     }

     fs.writeFileSync(this.target_directory + path.sep + fileName, bodyStr);
 }

 util.inherits(Jekyll, Engine);

 module.exports = Jekyll;