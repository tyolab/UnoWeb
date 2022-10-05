
const path = require('path');

function Engine (target_directory, options) {
    this.options = options || {};
    this.target_directory = target_directory || path.resolve(__dirname, '../../client');
}

Engine.prototype.build = function ($, filename){
}

module.exports = Engine;