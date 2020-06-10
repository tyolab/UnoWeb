/**
 * @file convert.js
 * 
 * Convert into template engine format from template
 * 
 */

const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

const engines = require('./lib/engines');

var Params = require('node-programmer/params');

var optsAvailable = {
    'dry-run': true,
    'from': {required: true},
    'to': 'client',
    'source': this.to || "client",
    'destination': 'public',
};

var params = new Params(optsAvailable, false);

var opts = params.getOpts();
var optCount = params.getOptCount();

const processor = new (require('./processor'))();

if (optCount <= 0) {
    params.usage();
    process.exit(-1);
}

var inputs = opts["---"];

// console.log(inputs);

/**
 * 
 */
const jekyll = engines.createJekyll(opts.to);

jekyll.initializeConfig(opts);

//console.log("Project source: ", jekyllConfig.source);

var rootFolder = inputs + path.sep + jekyll.config.source;
var targetFile = opts.from + path.sep + inputs;

const files = new (require('./lib/builder/files-builder'))(path.resolve(__dirname, 'templates/jekyll'), {
    "target_dir": opts.to;
});
processor.process(files);

const builder = new (require('./lib/builder/site-builder'))(rootFolder, opts);
processor.process(builder, targetFile);




