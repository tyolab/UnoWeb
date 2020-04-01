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

function isTextNode(node) {
    if (node && node.name !== 'script' && node.nodeType == 3 && nonWhitespaceMatcher.test(node.nodeValue)) {
        var text = unescape(node.nodeValue).replace(/{% comment %}.*{% endcomment %}/, '').replace(/{%.*%}/, '').replace(/{{.*}}/, '').trim();
        if (text.length < 3)
            return false;
        // no number
        var firstChar = text[0];
        if (firstChar >= '0' && firstChar <= '9')
            return false;
        var firstTwoChars = text.substr(0, 2);
        var firstThreeChars = text.substr(0, 3);
        return ((firstTwoChars !== "{%") && (firstTwoChars !== "{{")) && firstThreeChars !== '---';// translatedMatcher.test(text);
    }
    // if (node.childNodes && node.childNodes.length > 0 && node.childNodes[0] && node.childNodes[0].nodeType == 3) {
    //     return nonWhitespaceMatcher.test(node.childNodes[0].nodeValue);
    // }
    return false;
}

var getTextNodesIn2 = function(el) {
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
            if (includeWhitespaceNodes || isTextNode(node)/* nonWhitespaceMatcher.test(node.nodeValue) */) {
                textNodes.push(node);
            }
        } else {
            if (node.childNodes)
                for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                    getTextNodes(node.childNodes[i]);
                }
        }
    }

    getTextNodes(node);
    return textNodes;
}

function LanguageBuilder(base, opts) {
    Builder.call(this, base, opts);
}

util.inherits(LanguageBuilder, Builder);

function checkNodeName(node, name) {
    return node && node.name && node.name === name;
}

function checkParentName(node, name) {
    return node && node.parent && node.parent.name && node.parent.name === name;
}

LanguageBuilder.prototype.build = function(level, htmlFile) {
    var self = this;

    var file = htmlFile.substr(this.base.length);
    var data = fs.readFileSync(htmlFile, "utf8");

    var $ = cheerio.load(data);

    var nodeSet = new Set();

    var $textNodes;
    
    if (this.opts.selectors) {
        var elems = $(this.opts.selectors);
        $textNodes = elems.addBack().contents().filter(function() {
        return isTextNode(this);
      });
    }
    else
        $textNodes = getTextNodesIn($(':root')[0]);

    for (var i = 0; i < $textNodes.length; ++i) {
        var textNode = $textNodes[i];
        var confirmedNode;
        // we need to include span between text nodes
        if ((checkParentName(textNode, 'span'))
            && (
                isTextNode(textNode.parent.prev)
                &&
                isTextNode(textNode.parent.next)
                )
                ) {
            confirmedNode = textNode.parent.parent;
        }
        else
            confirmedNode = textNode;
        if (!nodeSet.has(confirmedNode))
            nodeSet.add(confirmedNode);
        //console.log(textNode);
    }

    /**
     * Create a parent key
     */
    var fileString = file.replace('_includes/', '');
    var dotPos = fileString.indexOf('.');
    if (dotPos > -1)
        fileString = fileString.substring(0, dotPos);
    var groups = fileString.split(path.sep);
    groups.shift();
    var parentKey = groups.join('.');

    nodeSet.forEach(function(node){
        var $node = $(node);
        var targetNode;
        var text;
        if (node.nodeType === 3) {
            text = node.nodeValue;
            targetNode = $(node.parent);
        }
        else {
            text = $node.html();
            targetNode = $node;
        }
        var isHeadingTag = false;
        var isLinkTag = false;
        if (checkParentName(node, 'a'))
            isLinkTag = true;
        else 
            isHeadingTag = node.parent && /h\d/.test(node.parent.name);

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
                key = 'common.' + text.replace(/\s+/g, '-').replace(/[\W_]+/g, "").toLowerCase();
            }
            // rule #2
            // by levels
            // the file
            else {
                var current_date = (new Date()).valueOf().toString();
                var random = Math.random().toString();
                var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
                var childKey;
                if (isHeadingTag) 
                    childKey = 'heading';
                else if (isLinkTag)
                    childKey = 'link-name';
                else
                    childKey = node.parent ? node.parent.name : 'text';
                
                key = parentKey + '.' + childKey + '-' + hash.substr(0, 5);
            }

            // now we need to put the kep and text into the map
            self.invertedLangMap.addTranslation(key, text);
        }
        var innerHtml = targetNode.html();
        innerHtml.replace(text, "{% t " + key + " %}");

        targetNode.html(innerHtml);
    });

    // it will automatically add <html><body></body></html>
    if ($textNodes.length > 0) {
        var htmlContent;
        if (data.indexOf("<body") > -1)
            htmlContent =  $.html();
        else
            htmlContent =  $('body').html();
        if (!this.opts['dry-run'])
        fs.writeFileSync(htmlFile, htmlContent);
        else
        // for DEBUG
            console.log(htmlContent);
    }
    else {
        // 
        console.log('No changes: '  + file);
        console.log();
    }

    // for DEBUG
    // process.stdin.setRawMode(true);
    // fs.readSync(0, Buffer.alloc(1), 0, 1);
}

LanguageBuilder.prototype.export = function(html) {
    this.invertedLangMap.generateI18nFiles(this.opts['dry-run']);
}

module.exports = LanguageBuilder;