const util = require('util');
const fs = require('fs');
const path = require('path');

var Builder = require('./builder');

function SiteBuilder(base, opts) {
    Builder.call(this, base, opts);

    this.targetDir = opts.target_dir;

    if (!this.targetDir)
        throw new Exception('Option "target_dir" must be specified.');
}

util.inherits(SiteBuilder, Builder);

SiteBuilder.prototype.build = function(level, src) {
    var file = src.substr(this.base.length);

    var targetFile = this.targetDir + path.sep + file;
    var parentDir = path.dirname(targetFile);

    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.copyFile(src, targetFile);
}

module.exports = SiteBuilder;