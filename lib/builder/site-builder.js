const util = require('util');
const fs = require('fs');
const path = require('path');

var cheerio = require('cheerio');

var Builder = require('./builder');

function SiteBuilder(base, opts) {
    Builder.call(this, base, opts);
}

util.inherits(SiteBuilder, Builder);

SiteBuilder.prototype.build = function(engine, templateFile) {
    var data = fs.readFileSync(templateFile, "utf8");
    var $ = cheerio.load(data);


    engine.build($);
}

SiteBuilder.prototype.export = function(html) {
    
}

module.exports = SiteBuilder;