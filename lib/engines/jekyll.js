/**
 * @file jekyll.js
 */
const yaml = require('yaml');

const fs = require('fs');

 function Jekyll (directory) {
    this.directory = directory;
    this.configFile = folder + path.sep + "_config.yml";

    // sub directories
     this.directories: ['_includes', '_i18n', '_data', '_layouts', '_plugins', '_posts', 
    '_sass']

    this.makeDirectories: function () {
        this.directories.map((index, folder) => {
            fs.mkdir(folder);
        });
    }

    this.isValid: function () {
        return fs.existsSync(this.configFile);
    }

    this.parseConfig: function () {
        const file = fs.readFileSync(this.configFile, 'utf8');
        this.config = yaml.parse(file);
    }

    if (this.isValid())
        this.parseConfig();
 }

 Jekyll.prototype.initializeConfig = function (opts) {
     const jekyll = this;
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

 Jekyll.prototype.build = function ($) {
     // write all elements

     // write layout
     

     // write head


     // write body
     // write header

     // write footer
 }

 module.exports = Jekyll;