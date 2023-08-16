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

    this.initialize = function () {
        if (!fs.existsSync(self.target_directory) || self.options.overwrite)
            fse.copySync(template_directory, self.target_directory, { overwrite: true })
        this.directories.map((folder) => {
            self[folder] = self.target_directory + path.sep + folder;
        });

        console.log('NextJs template initialized!')
    }

    this.initialize();
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
                let partStr = html_utils.treat_react(partElem.html());
                let partTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + part + '.js.hbs', 'utf8'));
                let part_obj = {
                    html: partStr,
                };

                let partJs = partTpl(part_obj);
                fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + part + '.js', partJs);
                partElem.remove();
            }
        });

        // var navElem = $('nav');
        // if (navElem.length > 0) {
        //     var navStr = html_utils.treat_react(navElem.html());
        //     var navTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + "nav.js.hbs", 'utf8'));
        //     var navJs = navTpl({nav_html: navStr});
        //     fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "nav.js", navJs);
        //     navElem.remove();
        // }

        // // write header
        // var headerElem = $('header');
        // if (headerElem.length) {
        //     var headerStr = html_utils.treat_react(headerElem.html());
        //     var headerTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + "header.js.hbs", 'utf8'));
        //     var headerHtml = headerTpl({header_html: headerStr});            
        //     fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "header.js", headerHtml);
        //     $('header').remove();
        // }

        // // write footer
        // var footerElem = $('footer');
        // if (footerElem.length) {
        //     var footerStr = html_utils.treat_react(footerElem.html());
        //     var footerTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + "footer.js.hbs", 'utf8'));
        //     var footerHtml = footerTpl({footer_html: footerStr});

        //     fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "footer.js", footerHtml);

        //     $('footer').remove();
        // }
    }

    let sectionNames = [];
    let sections_array = [];

     var $body = $('body');
     var $sections = $('section', $body);
     if ($sections.length) {
        // $sections.map((index, section) => {
        let index = 0; 
        for (; index < $sections.length; index++) {
            let section = $sections[index];
            let sectionId = $(section).attr('id') || ("section" + index);
            let sectionClass = sectionId;
            let sectionVariable = sectionClass.toLowerCase();
            let sectionName = sectionClass[0].toUpperCase() + sectionClass.slice(1);

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

            let contentStr = "";
            /** 
             * Get Heading up to 6
             */
            for (var i = 0; i < 7; i++) {
                var heading = $(`h${i + 1}`, section);
                if (heading.length) {
                    contentStr += `${"#".repeat(i + 1)} ${heading.text()}\n`;
                    // $(heading).remove();
                    $(heading).text(`{content.h${i + 1}[0]}`);
                }
            }
            
            let paragraphs = $('p', section);
            for (var i = 0; i < paragraphs.length; i++) {
            // paragraphs.map((index, paragraph) => {
                let paragraph = paragraphs[i];
                let paragraphStr = $(paragraph).clone().wrap("<div/>").parent().html().trim();
                contentStr += paragraphStr;
                // $(paragraph).remove();
                $(paragraph).text(`{content.p[${i}]}`);
            }
            // );
            contentFile = contentPath + path.sep + sectionVariable + ".mdx";
            fs.writeFileSync(contentFile, contentStr);

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
                    $(link).attr('href', "{settings.links[" + (i) + "].href}");
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
                    $(image).attr('src', "{settings.images[" + (i) + "]}");
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
                var settingFile = settingsPath + path.sep + sectionVariable + '.json';
                fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));
            }

            let styleStr = "";
            let styleFile = stylePath + path.sep + sectionVariable + '.module.sass';
            fs.writeFileSync(styleFile, styleStr);

            var sectionStr = $($container)
            .clone()
            .wrap("<div/>")
            .html()
            .replace(/class=\"/g, "className=\"")
            .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "") // remove comments
            ;

            var sectionFile = sectionVariable + '.js';
            let sectionTpl = handlebars.compile(fs.readFileSync(handlebars_partials_directory + path.sep + "section.js.hbs", 'utf8'));
            let section_data = {
                ...section_obj,
                html: sectionStr,
            }

            let bodyStr = sectionTpl(section_data);

            fs.writeFileSync(componentPath + path.sep + sectionFile, bodyStr);
        }
     }
     else {
        bodyStr += bodyElem.html();
     }
    //  let layoutStr = "";
    //  sectionNames.map((section, index) => {
    //     layoutStr += `
    //         <${section[0]} id="${section[1]}" content={${section[1]}.content} settings={${section[1]}.settings} />\n`;
    //     });

    // let propsStr = "";
    // sectionNames.map((section, index) => {
    //     propsStr += `
    //     const ${section[1]} = await getContentAndSettings('${name}', '${section[1]}');\n`;
    // });

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