/**
 * @file language-builder.js
 * 
 * The i18n locale builder
 */

const util = require('util');
const fs = require('fs');

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
    var file = html.substr(this.base.length);
    var data = fs.readFileSync(html, "utf8");

    var $ = cheerio.load(data);
    // 
    // console.log(file);
    var nodeSet = new Set();

    var $textNodes = $("h1, h2, h3, h4, h5, div, a, p").addBack().contents().filter(function() {
        if (this.nodeType == 3 && nonWhitespaceMatcher.test(this.nodeValue)) {
            var text = this.nodeValue.trim();
            return !text.startWith("{%");// translatedMatcher.test(text);
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
        $node.html("{% t 404-error.p-hade %}");
    });

    console.log($.html());
}

module.exports = LanguageBuilder;