/**
 * 
 */

const path = require('path');
const yaml = require('yaml');
const fs = require('fs');
const bunyan = require('bunyan');
const logger = bunyan.createLogger({"name": "InvertedLangKey"});

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

function parseYamlFile(yamlFile) {
    var yamlZh;
    try {
        file = fs.readFileSync(yamlFile, 'utf8');
        yamlZh = yaml.parse(file);
    }
    catch (error) {
        console.error("file: " + yamlFile);
        if (error.makePretty)
            error.makePretty();
        console.error(JSON.stringify(error));
        process.exit(-1);
    }
    return yamlZh;
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
     
    this.map = {};
    this.langs = {};
    // we will always use "en" as main language
    var i18nDir = clientFolder + path.sep + "_i18n";
    if (!fs.existsSync(i18nDir))
        fs.mkdirSync(i18nDir, { recursive: true });

    var self = this;
    var yamlEn, yamlZh;
    this.localizations.map((lang) => {
        self.langFiles[lang] = i18nDir + path.sep + lang + ".yml";

        if (fs.existsSync(self.langFiles[lang])) {
            yamlLang = parseYamlFile(self.langFiles[lang]);

            if (lang !== "en")
                createKeyMap(lang, self.langs, yamlLang);
            else
                yamlEn = yamlLang;
        }
    });


    // this.langFiles.en =  + path.sep + "en.yml";
    // yamlEn = parseYamlFile(this.langFiles.en);

    // this.langFiles.zh = clientFolder + path.sep + "_i18n" + path.sep + "zh.yml";
    // yamlZh = parseYamlFile(this.langFiles.zh);

    // this.langs.zh = {};
    // this.keys = {};
    //createKeyMap('zh', this.langs, yamlZh);
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
        var tran = this.langs[key];
        var path = tran.path;
        if (!path || path.length === 0)
            path = key.split('.');
        var text = tran.i18n[lang] || tran.i18n['en'] || "&nbsp;";
        //var text = tran.i18n[lang];
        // need to clone the path, otherwise the path will be cleared
        shiftPath(obj, [].concat(path), text);
    }

    // for DEBUG
    // console.log(yaml.stringify(obj));
    return yaml.stringify(obj);
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

InvertedLangKey.prototype.generateI18nFiles = function(isDryRun) {
    var self = this;

    // this.fillMissingKeys();

    this.localizations.map(function(lang) {
    // this.otherLangs.map(function(lang) {
        var langFile = self.getLanguageFile(lang);

        var yamlText = self.createLanguageJson(lang);

        // for DEBUG
        if (isDryRun)
            console.log(yamlText);
        else
            fs.writeFileSync(langFile, yamlText);
    });
}

module.exports = InvertedLangKey;