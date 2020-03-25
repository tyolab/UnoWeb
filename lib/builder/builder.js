/**
 * @file builder.js
 */
const InvertedLangKeys = require('../invert-lang-key');

 function Builder(base) {
    this.base = base;

    this.invertedLangMap = new InvertedLangKeys(base); 
 }

 module.exports = Builder;