/**
 * @file language-builder.js
 * 
 * The i18n locale builder
 */

const util = require('util');
const fs = require('fs');

var cheerio = require('cheerio');

var Builder = require('./builder');

function LanguageBuilder(base) {
    Builder.call(this, base);
}

util.inherits(LanguageBuilder, Builder);

LanguageBuilder.prototype.build = function(level, html) {
    var file = html.substr(this.base.length);

    var $ = cheerio.load(html);
    // var data = fs.readFileSync(html, "utf8"");
    // console.log(file);
}

module.exports = LanguageBuilder;