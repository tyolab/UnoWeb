const util = require('util');
const fs = require('fs');
const path = require('path');

var Builder = require('./builder');

function FilesBuilder(base, opts) {
    Builder.call(this, base, opts);

    this.targetDir = opts.target_dir;

    if (!this.targetDir)
        throw new Exception('Option "target_dir" must be specified.');
}

util.inherits(FilesBuilder, Builder);

FilesBuilder.prototype.build = function(level, src) {
    var file = src.substr(this.base.length);

    var targetFile = this.targetDir + (file.charAt(0) === path.sep ? '' : path.sep) + file;
    var parentDir = path.dirname(targetFile);

    if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.copyFileSync(src, targetFile);
}

module.exports = FilesBuilder;