
const fs = require('fs');
const path = require('path');

const Jekyll = require('./jekyll');

module.exports = {
    isJekyll: function(folder) {
        const jekyll = new Jekyll(folder);
        return jekyll.isValid();
    },

    createJekyll: function (folder) {
        return new Jekyll(folder);
    }
}