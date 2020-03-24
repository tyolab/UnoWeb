/**
 * @file language-builder.js
 * 
 * The i18n locale builder
 */

const util = require('util');

var Builder = require('./builder');

function LanguageBuilder() {

}

util.inherits(LanguageBuilder, Builder);

LanguageBuilder.prototype.build = function(level, html) {

}

module.exports = LanguageBuilder;