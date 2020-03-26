/**
 * @file language-builder.js
 * 
 * The i18n locale builder
 */

const util = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

var cheerio = require('cheerio');

var Builder = require('./builder');

const nonWhitespaceMatcher = /\S/;
const translatedMatcher = /{%.*%}/;

var getTextNodesIn = function(el) {
    return $(el).find(":not(iframe)").addBack().contents().filter(function() {
        return this.nodeType == 3;
    });
};

/**
 * https://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
 * 
 * @param {*} node 
 * @param {*} includeWhitespaceNodes 
 */
function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [];

    function getTextNodes(node) {
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}

function LanguageBuilder(base) {
    Builder.call(this, base);
}

util.inherits(LanguageBuilder, Builder);

LanguageBuilder.prototype.build = function(level, html) {
    var self = this;

    var file = html.substr(this.base.length);
    var data = fs.readFileSync(html, "utf8");

    var $ = cheerio.load(data);
    // 
    console.log(file);
    console.log();

    var nodeSet = new Set();

    var $textNodes = $("h1, h2, h3, h4, h5, div, a, p").addBack().contents().filter(function() {
        if (this.nodeType == 3 && nonWhitespaceMatcher.test(this.nodeValue)) {
            var text = this.nodeValue.trim();
            return text.indexOf("{%") < 0;// translatedMatcher.test(text);
        }
        // if (this.childNodes && this.childNodes.length > 0 && this.childNodes[0] && this.childNodes[0].nodeType == 3) {
        //     return nonWhitespaceMatcher.test(this.childNodes[0].nodeValue);
        // }
        return false;
      });

    for (var i = 0; i < $textNodes.length; ++i) {
        var textNode = $textNodes[i];
        var parentNode;
        // we need to include span between text nodes
        if (textNode.parent && textNode.parent.name 
            && (textNode.parent.name == "span" || textNode.parent.name == "br")
            && (
                (textNode.parent.prev && textNode.parent.prev.nodeType == 3)
                ||
                (textNode.parent.next && textNode.parent.next.nodeType == 3)
                )) {
            parentNode = textNode.parent.prev.parent;
        }
        else
            parentNode = textNode.parent;
        if (!nodeSet.has(parentNode))
            nodeSet.add(parentNode);
        //console.log(textNode);
    }

    nodeSet.forEach(function(node){
        var $node = $(node);
        var text = $node.html();
        var isHeadingTag = false;
        var isLinkTag = false;
        if (node.name === 'a')
            isLinkTag = true;
        else 
            isHeadingTag = /h\d/.test(node.name);

        // we already has the translation
        var tran = self.invertedLangMap.findTranslation(text);
        var key;
        if (tran) {
            key = tran.key;
        }
        else {
            // if we don't
            // we already has the key
            // we need to add text to the inverted key map
            // what kind of key we wanna use
            // rule #1
            // if the text contains three words or less we put it in
            var words = text.match(/\w+/g).length;
            if (words <= 4 && text.indexOf('<span') < 0) {
                // the common group
                key = 'common.' + text.replace(/\s+/g, '-').toLowerCase();
            }
            // rule #2
            // by levels
            // the file
            else {
                var groups = file.split(path.sep);
                groups.shift();
                var parentKey = groups.join('.');

                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
                var childKey;
                if (isHeadingTag) 
                    childKey = 'heading';
                else if (isLinkTag)
                    childKey = 'link-name';
                else
                    childKey = node.name;
                
                key = parentKey + '.' + childKey + '-' + hash.substr(0, 5);
            }

            // now we need to put the kep and text into the map
            self.invertedLangMap.addTranslation(key, text);
        }

        $node.html("{% t " + key + " %}");
    });


    console.log($.html());

    // for DEBUG
    process.stdin.setRawMode(true);
    fs.readSync(0, Buffer.alloc(1), 0, 1);
}

module.exports = LanguageBuilder;