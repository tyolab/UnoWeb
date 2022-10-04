module.exports =  {
    treat_react: function (html) {
        return html
        .replace(/class=\"/g, "className=\"")
        .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "") // remove comments;
    }
}