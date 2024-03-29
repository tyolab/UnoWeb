const util = require('util');
const fs = require('fs');
const path = require('path');

var cheerio = require('cheerio');

var Builder = require('./builder');

function SiteBuilder(base, opts) {
    Builder.call(this, base, opts);

    this.engine = null;
}

util.inherits(SiteBuilder, Builder);

SiteBuilder.prototype.build = function(level, templateFile) {
    var data = fs.readFileSync(templateFile, "utf8");
    var $ = cheerio.load(data,
        {
            xmlMode: true,
            decodeEntities: false,
            // selfClosingTags: false,
        }
        );

   this.engine.build($, this.page || path.basename(templateFile));
}

SiteBuilder.prototype.export = function(html) {
    
}

module.exports = SiteBuilder;