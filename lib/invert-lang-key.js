/**
 * 
 */

const path = require('path');
const yaml = require('yaml');
const fs = require('fs');

function pushMap() {

}

function pathToKey(path, key) {
    return path && path.length > 0 ? path + "." + key : key;
}

function pathArrayToKey(path, key) {
    var paths = path.join('.');
    if (key)
    return pathToKey(paths, key);
    return paths;
}

function createKeyMap(lang, map, yamlJson, path) {
    for (var key in yamlJson) {
        var obj = yamlJson[key];

        if (typeof obj === 'string') {
            map[pathToKey(path, key)] = {};
            map[pathToKey(path, key)][lang] = obj; 
        }
        else if (typeof obj === 'object') {
            createKeyMap(map, obj, pathToKey(path, key));
        }
    }
}

function createInvertedMap(langs, map, yamlJson, path) {
    for (var key in yamlJson) {
        var obj = yamlJson[key];

        if (typeof obj === 'string') {
            if (!map[obj]) {
                map[obj] = {};
                map[obj].path = [].concat(path);
                map[obj].path.push(key);
                map[obj].key = pathArrayToKey(map[obj].path);

                // langs
                langs[key] = langs[key] | {};
                langs[key].en = obj;
            }
        }
        else if (typeof obj === 'object') {
            var newPath;
            if (path.length > 0)
                newPath = [].concat(path);
            else
                newPath =[];

             newPath.push(key);
            createInvertedMap(map, obj, newPath);
        }
    }
}

function InvertedLangKey (clientFolder) {

    var existingLangFile = clientFolder + path.sep + "_i18n" + path.sep + "en.yml";
    var file = fs.readFileSync(existingLangFile, 'utf8');
    const yamlEn = yaml.parse(file);

    existingLangFile = clientFolder + path.sep + "_i18n" + path.sep + "zh.yml";
    file = fs.readFileSync(existingLangFile, 'utf8');
    const yamlZh = yaml.parse(file);
    
    this.map = {};
    this.langs = {};
    // this.langs.zh = {};
    // this.keys = {};

    createKeyMap(this.langs, yamlZh);
    createInvertedMap(this.langs, this.map, yamlEn, []);
}

module.exports = InvertedLangKey;