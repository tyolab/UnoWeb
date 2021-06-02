/**
 * 
 */

const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

var Params = require('node-programmer/params');

const engines = require('./lib/engines');

var optsAvailable = {
    'dry-run': true,
    // 'selectors': "h1, h2, h3, h4, h5, h6, div, a, p, span, li, button"
};

var params = new Params(optsAvailable, false);

var opts = params.getOpts();
var optCount = params.getOptCount();

const processor = new (require('./processor'))();

if (optCount <= 0) {
    // indexer.usage();
    process.exit(-1);
}

var inputs = opts["---"];

// console.log(inputs);

const jekyll = engines.createJekyll(inputs);

/**
 * 
 */
if (!jekyll.isValid()) {
    console.error("Not a valid jekyll folder");
    process.exit(-1);
}

console.log("Project source: ", jekyll.config.source);

var rootFolder = inputs + path.sep + jekyll.config.source;

const builder = new (require('./lib/builder/language-builder'))(rootFolder, opts);
processor.process(builder, rootFolder, builder.export.bind(builder));

// builder.export();

/**
 * for Debug
 */
// for (var key in builder.invertedLangMap.map) {
//     var obj = builder.invertedLangMap.map[key];
//     console.log(key);
//     console.log('path: ' + JSON.stringify(obj.path));
//     console.log('key: ' + obj.key + "\n");
// }

// outputting _i18n files for manual translations


