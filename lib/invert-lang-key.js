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
            map[pathToKey(path, key)].i18n = map[pathToKey(path, key)].i18n || {};
            map[pathToKey(path, key)].i18n[lang] = obj; 
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
                    var targetKey = map[obj].key;
                    langs[targetKey] = langs[targetKey] || {};
                    langs[targetKey].i18n = langs[targetKey].i18n || {};
                    langs[targetKey].i18n.en = obj;
                    langs[targetKey].path = map[obj].path;
                }
            }
            else if (typeof obj === 'object') {
                createInvertedMap(langs, map, obj, createNewPathArray(path, key));
            }
        }
}

function InvertedLangKey (clientFolder, localizations) {
    var self = this;
    this.home = clientFolder;

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

function shiftPath(obj, paths, text) {
    if (!paths)
        console.error("Bug");
    var path = paths.shift();
    obj[path] = obj[path] || {};
    if (paths.length > 0)
        shiftPath(obj[path], paths, text);
    else
        obj[path] = text;
}

InvertedLangKey.prototype.createLanguageJson = function (lang) {
    var obj = {};
    
    for (var key in this.langs) {
        var path = this.langs[key].path;
        if (!path)
            path = key.split('.');
        var text = this.langs[key].i18n[lang] || this.langs[key].i18n['en'] || "&nbsp;";
        //var text = this.langs[key].i18n[lang];
        shiftPath(obj, path, text);
    }

    // for DEBUG
    console.log(yaml.stringify(obj));
}

InvertedLangKey.prototype.getLanguageFile = function(lang) {
    return this.home + path.sep + "_i18n" + path.sep + lang + ".yml";
}

InvertedLangKey.prototype.fillMissingKeys = function() {
    for (var key in this.langs) {
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
    var self = this;

    // add translation to the inverted map
    this.map[text] = this.map[text] || {};
    this.map[text].path = key.split('.');
    this.map[text].key = key;

    if (this.langs[key]) 
        console.warn('Existing key: ' + key);
    else
        this.langs[key] = {};

    this.langs[key].i18n = this.langs[key].i18n || {};
    this.langs[key].path = this.map[text].path;

    // add translation to the key map
    this.localizations.forEach(function (lang) {
        if (!self.langs[key].i18n[lang])
            self.langs[key].i18n[lang] = text;
    }); 
}

InvertedLangKey.prototype.generateI18nFiles = function() {
    var self = this;

    // this.fillMissingKeys();

    // this.localizations.map(function(lang) {
    this.otherLangs.map(function(lang) {
        var langFile = self.getLanguageFile(lang);

        self.createLanguageJson(lang);
    });
}

module.exports = InvertedLangKey;