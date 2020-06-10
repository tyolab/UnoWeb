/**
 * @file builder.js
 */

 function Builder(base, opts) {
    this.base = base;
    this.opts = {};

    this.opts['dry-run'] = opts['dry-run'] || false;
    this.opts.selectors = opts.selectors;

 }

 module.exports = Builder;