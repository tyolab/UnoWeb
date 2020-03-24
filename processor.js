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
        "includes": "*.html", // []
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

Processor.prototype.process_folder = function (builder, folder, callback) {
    var self = this;

    fs.readdir(folder, (err, files) => {
        if (err)
            return;

        async.eachSeries(files, (file, done) => {
            self.process_file(builder, folder + "/" + file, done);
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

Processor.prototype.process_file = function (builder, file, done) {

    var self = this;

    if (fs.lstatSync(file).isDirectory()) {
        self.process_folder(builder, file, done);
        return;
    }

    if (this.includesRegExp && file.match(this.includesRegExp)) {

        var filename = path.basename(file);
        var data = fs.readFileSync(file, this.opts.encoding);

        console.log(file);
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

Processor.prototype.process = function (builder, inputs) {
    if (!Array.isArray(inputs))
        inputs = [inputs];
        
    var self = this;
    async.eachSeries(inputs, (inputFile, done) => {
        if (fs.lstatSync(inputFile).isDirectory())
            self.process_folder(builder, inputFile, done);
        else {
            self.process_file(builder, inputFile, done);
        }
    },
    (err) => {
        console.error(err);
        // builder.finish();
    }
    );
}

module.exports = Processor;