/**
 * @file processor.js
 * 
 * An example for how to create a custom processor
 */

const async = require("async");

const fs = require('fs');

const path = require('path');

/**
 * Processor class
 * 
 * @param {*} opts 
 */

function Processor(opts) {
    this.opts = opts || 

    // The default should be
    {
        "save-content": false,
        "encoding": "utf8",
        "includes": "[\/]*\.html$", // []
        "excludes": []
    };

    if (this.opts["save-content"] === undefined)
        this.opts["save-content"] = false;
    
    this.opts.encoding = this.opts.encoding || "utf8";

    if (this.opts.includes) {
        this.includesRegExp = new RegExp(this.opts.includes, "i");
    }
}

/**
 * 
 */

Processor.prototype.process_folder = function (builder, folder, level, levels, callback) {
    var self = this;

    fs.readdir(folder, (err, files) => {
        if (err)
            return;

        async.eachSeries(files, (file, done) => {
            var targetFile = folder + "/" + file;
            if (fs.lstatSync(targetFile).isDirectory())
                if (levels !== -1 && level >= levels)
                    done();
                else
                    self.process_folder(builder, targetFile, level + 1, levels, done);
            else 
                self.process_file(builder, targetFile, level, done);
        },
        (err) => {
            if (err)
                console.error(err);
            callback();
        });
    });

}

/**
 * 
 */

Processor.prototype.process_file = function (builder, file, level, done) {

    var self = this;

    if (this.includesRegExp && file.match(this.includesRegExp)) {

        // var filename = path.basename(file);
        // var data = fs.readFileSync(file, this.opts.encoding);

        builder.build(level, file);
        // var save_content = this.opts ? this.opts["save-content"] : false;
        // this.index_document(builder, filename, data, save_content  ? data : null);
    }

    if (done)
        done();
}

/**
 * Override me to add the logic
 * By the default, we will use the file name as title
 * the whole content the file as text
 */

Processor.prototype.process = function (builder, inputs, levels, callback) {
    if (!Array.isArray(inputs))
        inputs = [inputs];

    if (typeof levels === 'function') {
        callback = levels;
        levels = -1;
    }
        
    var self = this;
    async.eachSeries(inputs, (inputFile, done) => {
        if (fs.lstatSync(inputFile).isDirectory())
            self.process_folder(builder, inputFile, 0, levels, done);
        else {
            self.process_file(builder, inputFile, 0, done);
        }
    },
    (err) => {
        if (err)
            console.error(err);
        //builder.export();
        if (callback)
            callback();
    }
    );
}

module.exports = Processor;