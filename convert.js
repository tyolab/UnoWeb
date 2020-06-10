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
    'source': "client",
    'destination': 'public',
    'from': {required: true},
};

optsAvailable.to = '.' + path.sep + optsAvailable.source;

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

var rootFolder = opts.to;
var targetFile = opts.from + path.sep + inputs;
var templateFolder = path.resolve(__dirname, 'templates/jekyll');

const files = new (require('./lib/builder/files-builder'))(templateFolder, {
    "target_dir": opts.to
});
processor.process(files, templateFolder, function() {
    const builder = new (require('./lib/builder/site-builder'))(rootFolder, opts);
    builder.engine = jekyll;
    processor.process(builder, targetFile);
});





