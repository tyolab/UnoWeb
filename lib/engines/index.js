
const fs = require('fs');
const path = require('path');

const Jekyll = require('./jekyll');

module.exports = {
    isJekyll: function(folder, options) {
        const jekyll = new Jekyll(folder, options);
        return jekyll.isValid();
    },

    createJekyll: function (folder, options) {
        return new Jekyll(folder, options);
    },

    create: function (engine, folder, options) {
        switch (engine) {
            case 'nextjs':
                return new (require('./nextjs'))(folder, options);
            default:
            case 'jekyll':
                return this.createJekyll(folder, options);
        }
    }
}