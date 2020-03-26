/**
 * 
 */

const yaml = require('yaml');
const fs = require('fs');
const path = require('path');

var Params = require('node-programmer/params');

var optsAvailable = {
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

var jekyllConfigFile = inputs + path.sep + "_config.yml";

/**
 * 
 */
if (!fs.existsSync(jekyllConfigFile)) {
    console.error("Not a valid jekyll folder");
    process.exit(-1);
}

const file = fs.readFileSync(jekyllConfigFile, 'utf8');
const jekyllConfig = yaml.parse(file);

console.log("Project source: ", jekyllConfig.source);

var rootFolder = inputs + path.sep + jekyllConfig.source;

const builder = new (require('./lib/builder/language-builder'))(rootFolder);
processor.process(builder, rootFolder);

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


