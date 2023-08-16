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
    'from': {required: true, nullable: false},
    'engine': 'jekyll',
    'page': 'home',
    'strip_layout': true,
    'mode': 'xml', // could be xml, html, text,
    'overwrite': false,
    'section': "",
};

// optsAvailable.to = '.' + path.sep + optsAvailable.source;

var params = new Params(optsAvailable, false);

var opts = params.getOpts();
var optCount = params.getOptCount();

opts.sections = opts.section.split(",");
delete opts.section;

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
const engine = engines.create(opts.engine, opts.to, opts);

engine.initialize(opts);

//console.log("Project source: ", jekyllConfig.source);

var rootFolder = engine.target_directory;
var targetFile = opts.from + path.sep + inputs;
var templateFolder = path.resolve(__dirname, 'boilerplates/' + opts.engine);

const files = new (require('./lib/builder/files-builder'))(templateFolder, {
    "target_dir": engine.target_directory
});
processor.process(files, templateFolder, function() {
    const builder = new (require('./lib/builder/site-builder'))(rootFolder, opts);
    builder.engine = engine;
    builder.page = opts.page;
    processor.process(builder, targetFile);
});





