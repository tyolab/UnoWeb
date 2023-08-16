/**
 * We can use template engine to generate the content
 * 
 * Options 1: mustache.js
 * Options 2: ejs
 * Options 3: handlebars
 * 
 * 
 */
const fs = require('fs');
const fse = require('fs-extra');

const handlebars = require('handlebars');

const util = require('util');

const path = require('path');

const Engine = require('./engine');

const crypto = require('crypto');

const html_utils = require('../utils/html');

const template_directory = path.resolve(__dirname, '../../boilerplates/nextjs');
const handlebars_directory = path.resolve(__dirname, '../../templates/nextjs/handlebars');
const handlebars_partials_directory = path.resolve(handlebars_directory, 'partials');

function NextJs (target_directory, options) {

    Engine.call(this, target_directory, options);

    let self = this;

    this.directories = ['components', 'settings', 'content', 'styles', "parts"/* , "components.common", "content.home" */];

    this.initialize = function (opts) {
        if (!fs.existsSync(self.target_directory) || self.options.overwrite)
            fse.copySync(template_directory, self.target_directory, { overwrite: true })
        this.directories.map((folder) => {
            self[folder] = self.target_directory + path.sep + folder;
        });

        console.log('NextJs template initialized!')
    }

    // this.initialize();
}

NextJs.prototype.extract_partial = function ($, section, section_obj, options) {
    let { section_variable} = section_obj;
    let {type, settings_path, style_path, content_path, parts_path, target_dir } = options;
    type = type || "section";
    let contentStr = "";
    /** 
     * Get Heading up to 6
     */
    for (var i = 0; i < 7; i++) {
        var headings = $(`h${i + 1}`, section);
        if (headings.length) {
            for (let i = 0; i < headings.length; i++) {
                let heading = $(headings[i]);
            // headings.forEach((index, heading) => {
                contentStr += `${"#".repeat(i + 1)} ${heading.text()}\n`;
                // $(heading).remove();
                $(heading).text(`{content.h${i + 1}[0]}`);
            }
        }
    }
    
    let paragraphs = $('p', section);
    for (var i = 0; i < paragraphs.length; i++) {
    // paragraphs.map((index, paragraph) => {
        let paragraph = paragraphs[i];
        let p_html = $(paragraph).clone().wrap("<div/>").parent().text();
        let paragraphStr = p_html/* .text() */.trim();
        contentStr += paragraphStr;
        // $(paragraph).remove();
        $(paragraph).text(`{content.p[${i}]}`);
    }
    // );
    contentFile = content_path + path.sep + section_variable + ".mdx";
    fs.writeFileSync(contentFile, contentStr);

    let links_to_be_replaced = {};
    let settings = null;
    let links = $('a', section);
    // links.map((index, link) => {
    for (var i = 0; i < links.length; i++) {
        let link = links[i];
        let href = $(link).attr('href');
        if (href) {
            if (!settings)
                settings = {};
            
            if (!settings.links)
                settings.links = [];
            settings.links.push({name: $(link).text(), href: href});
            // $(link).attr('href', "{settings.links[" + (i) + "].href}");
            links_to_be_replaced[href] = "{settings.links[" + (i) + "].href}";
            $(link).text("{settings.links[" + (i) + "].name}");
        }
    }
    // );

    let images = $('img', section);
    // images.map((index, image) => {
    for (var i = 0; i < images.length; i++) {
        let image = images[i];
        let src = $(image).attr('src');
        if (src) {
            if (!settings)
                settings = {};
            if (!settings.images)
                settings.images = [];
            settings.images.push(src);
            // $(image).attr('src', "{settings.images[" + (i) + "]}");
            links_to_be_replaced[src] = "{settings.images[" + (i) + "]}";
        }
    }
    // );

    let classNames = $(section).attr('class');
    if (classNames && classNames.length) {
        if (!settings)
            settings = {};
        settings.styles = settings.styles || {};
        settings.styles.section = classNames;
    }

    var $container = $('.container', section); // .find('.container');
    if (!$container.length)
        $container = section;
    else {
        classNames = $container.attr('class');
        if (!settings)
            settings = {};
        settings.styles = settings.styles || {};
        settings.styles.container = classNames;
    }
    
    if (settings) {
        var settingFile = settings_path + path.sep + section_variable + '.json';
        fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));
    }

    let styleStr = "";
    let styleFile = style_path + path.sep + section_variable + '.module.sass';
    fs.writeFileSync(styleFile, styleStr);

    var sectionStr = $($container)
    .clone()
    .wrap("<div/>")
    .html()
    // .xml()
    .replace(/class=\"/g, "className=\"")
    .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "") // remove comments
    ;
    
    let keys = Object.keys(links_to_be_replaced);
    keys.map((key) => {
        sectionStr = sectionStr.replace(new RegExp("\"" + key + "\"", 'g'), links_to_be_replaced[key]);
    });

    var sectionFile = section_variable + '.js';
    let sectionTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + type + ".js.hbs", 'utf8'));
    let section_data = {
        ...section_obj,
        html: sectionStr,
    }

    let bodyStr = sectionTpl(section_data);

    fs.writeFileSync(target_dir + path.sep + sectionFile, bodyStr);
}

NextJs.prototype.build = function ($, fileName) {
    const nextjs = this;
    fileName = fileName || "home";

    var names = fileName.split('.');
    var name = names[0];

    var settingsPath = nextjs.settings + path.sep + name;
    var stylePath = nextjs.styles + path.sep + name;
    var contentPath = nextjs.content + path.sep + name;
    var componentPath = nextjs.components + path.sep + name;
    var partsPath = nextjs.parts + path.sep + name;

    let all_paths = [stylePath, contentPath, componentPath, settingsPath, partsPath];

    all_paths.map((part_path) => {
        try {
            if (!fs.existsSync(part_path))
                fs.mkdirSync(part_path, { recursive: true });
            else {
                let files = fs.readdirSync(part_path);
                files.map((file) => {
                    fs.unlinkSync(part_path + path.sep + file);
                });
                // fs.readdir(part_path, (err, files) => {
                //     if (err) throw err;
                
                //     for (const file of files) {
                //     fs.unlink(path.join(part_path, file), err => {
                //         if (err) throw err;
                //     });
                //     }
                // });
            }
        }
        catch (err) {
            console.error(err);
        }
    });

     // write all elements

     // write layout
     
     // write head
    var headStr = $('head').html();
    fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "head.js", headStr);

     // 
     let common_parts = ["nav", "header", "footer"];
     if (nextjs.options.strip_layout) {
        common_parts.map((part) => {
            let partElem = $(part);
            if (partElem.length) {
                // let partStr = html_utils.treat_react(partElem.html());
                // let partTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + part + '.js.hbs', 'utf8'));
                // let part_obj = {
                //     html: partStr,
                // };

                // let partJs = partTpl(part_obj);
                // fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + part + '.js', partJs);
                nextjs.extract_partial($, partElem, {
                    section_name: part, 
                    section_variable: part,
                },
                {
                    settings_path: settingsPath,
                    style_path: stylePath,
                    content_path: contentPath,
                    parts_path: partsPath,
                    type: part, 
                    target_dir: nextjs.components + path.sep + "common",
                });
                partElem.remove();
            }
        });
    }

    if (nextjs.options.strip_layout_only)
        return;

    let sectionNames = [];
    let sections_array = [];

     var $body = $('body');
     var $sections = $('section', $body);
     if ($sections.length) {
        // $sections.map((index, section) => {
        let index = 0; 
        for (; index < $sections.length; index++) {
            let providedSectionInput = nextjs.options.sections && nextjs.options.sections[index];
            let providedSectionId = null;
            let providedSectionName = null;

            if (providedSectionInput) {
                let tokes = providedSectionInput.split('-');
                providedSectionId = tokes.join('');
                tokes = tokes.map((token) => {
                    return token.charAt(0).toUpperCase() + token.substr(1);
                }
                );
                providedSectionName = tokes.join('');
            }

            let section = $sections[index];
            let sectionId = $(section).attr('id') || providedSectionId || ("section" + index);
            let sectionClass = sectionId;
            let sectionVariable = sectionClass.toLowerCase();
            let sectionName = providedSectionName || (sectionClass[0].toUpperCase() + sectionClass.slice(1));

            let section_obj = {
                section_id: sectionId,
                section_name: sectionName,
                page_name: name,
                section_variable: sectionVariable,
            }

            sections_array.push(section_obj);

            // var sectionName = 'section' + index;
            sectionNames.push([sectionName, sectionVariable]);
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var hash = crypto.createHash('sha1').update(current_date + random).digest('hex').substr(0, 5);

            nextjs.extract_partial($, section, section_obj, {
                settings_path: settingsPath,
                style_path: stylePath,
                content_path: contentPath,
                parts_path: partsPath,
                target_dir: componentPath /* + path.sep + fileName */,
            });
        }
     }
     else {
        bodyStr += bodyElem.html();
     }

    let partDir = partsPath; // /* + name */ + (fileName === 'home' ? "" : (+ path.sep + fileName));
    let partFile = partDir + path.sep + "index.js";
    // write page
    var pageTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + "page.js.hbs", 'utf8'));
    let page_obj = {
        sections: sections_array,
        page_class: `${name.charAt(0).toUpperCase()}${name.substr(1)}`
    }
    let pageStr = pageTpl(page_obj);

     fs.writeFileSync(partFile, pageStr);    
}

util.inherits(NextJs, Engine);

module.exports = NextJs;