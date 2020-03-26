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
            map[pathToKey(path, key)] = map[pathToKey(path, key)] || {};
            map[pathToKey(path, key)][lang] = obj; 
        }
        else if (typeof obj === 'object') {
            createKeyMap(lang, map, obj, pathToKey(path, key));
        }
    }
}

function addTextToMap(path, key) {

}

function createNewPathArray(path, key) {
    var newPath;
    if (path.length > 0)
        newPath = [].concat(path);
    else
        newPath = [];

    newPath.push(key);
    return newPath;
}

function createInvertedMap(langs, map, yamlJson, path) {
    var isArray = Array.isArray(yamlJson);

        for (var key in yamlJson) {
            var obj;
            if (isArray)
                obj = yamlJson[key];
            else
                obj = yamlJson[key];                

            if (typeof obj === 'string') {
                if (!map[obj]) {
                    map[obj] = {};
                    map[obj].path = [].concat(path);
                    map[obj].path.push(key);
                    map[obj].key = pathArrayToKey(map[obj].path);

                    // langs
                    langs[map[obj].key] = langs[map[obj].key] || {};
                    langs[map[obj].key].en = obj;
                }
            }
            else if (typeof obj === 'object') {
                createInvertedMap(langs, map, obj, createNewPathArray(path, key));
            }
        }
}

function InvertedLangKey (clientFolder, localizations) {
    var self = this;

    this.localizations = localizations || ['en', 'zh'];
    this.otherLangs = [];
    this.localizations.map(function(lang) {
        if (lang !== 'en')
            self.otherLangs.push(lang);
    });

    this.langFiles = {};

    this.langFiles.en = clientFolder + path.sep + "_i18n" + path.sep + "en.yml";
    var file = fs.readFileSync(this.langFiles.en, 'utf8');
    const yamlEn = yaml.parse(file);

    this.langFiles.zh = clientFolder + path.sep + "_i18n" + path.sep + "zh.yml";
    file = fs.readFileSync(this.langFiles.zh, 'utf8');
    const yamlZh = yaml.parse(file);
    
    this.map = {};
    this.langs = {};
    // this.langs.zh = {};
    // this.keys = {};

    createKeyMap('zh', this.langs, yamlZh);
    createInvertedMap(this.langs, this.map, yamlEn, []);
}

InvertedLangKey.prototype.fillMissingKeys = function() {


    for (var key in this.langs.en) {
        otherLangs.map(function(lang) {
            if (!this.langs[key][lang])
                this.langs[key][lang] = this.langs['en'][key];
        });
    }
}

InvertedLangKey.prototype.findTranslation = function(text) {
    var tran = this.map[text];
    return tran;
}

InvertedLangKey.prototype.addTranslation = function(key, text) {
    if (this.langs[key]) 
        console.warn('Existing key: ' + key);

    // add translation to the key map
    this.localizations.forEach(function (lang) {
        if (!this.langs[key][lang])
            this.langs[key][lang] = text;
    }); 

    // add translation to the inverted map
    this.map[text] = this.map[text] || {};
    this.map[text].path = key.split('.');
    this.map[text].key = key;
}

module.exports = InvertedLangKey;