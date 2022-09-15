const fs = require('fs');
const fse = require('fs-extra');

const util = require('util');

const path = require('path');

const Engine = require('./engine');

const crypto = require('crypto');

const template_directory = path.resolve(__dirname, '../../templates/nextjs');

function NextJs (target_directory, options) {

    Engine.call(this, target_directory, options);

    let self = this;

    this.directories = ['components', 'settings', 'content', 'styles', "parts"/* , "components.common", "content.home" */];

    this.initialize = function () {
        fse.copySync(template_directory, self.target_directory, { overwrite: true })
        this.directories.map((folder) => {
            self[folder] = self.target_directory + path.sep + folder;
        });

        console.log('NextJs template intialized!')
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
                fs.mkdirSync(part_path);
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

     // write page
     var pageStr = `
import { getContentAndSettings, getSiteSettings  } from '../lib/content';

import Layout from '../components/layout';
     `;

     if (nextjs.strip_layout) {

        // write header
        var headerElem = $('header');
        if (headerElem.length) {
            var headerStr = headerElem.html();
            fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "header.js", headerStr);
            $('header').remove();
        }

        // write footer
        var footerElem = $('footer');
        if (footerElem.length) {
            var footerStr = footerElem.html();
            fs.writeFileSync(nextjs.components + path.sep + "common" + path.sep + "footer.js", footerStr);

            $('footer').remove();
        }
    }

    let sectionNames = [];

     var $body = $('body');
     var $sections = $('section', $body);
     if ($sections.length) {
        // $sections.map((index, section) => {
        let index = 0; 
        for (; index < $sections.length; index++) {
            let section = $sections[index];
            pageStr += `
import Section${index} from '../components/${name}/section${index}';`;

            var sectionName = 'section' + index;
            sectionNames.push(sectionName);
            var current_date = (new Date()).valueOf().toString();
            var random = Math.random().toString();
            var hash = crypto.createHash('sha1').update(current_date + random).digest('hex').substr(0, 5);

            let contentStr = "";
            /** 
             * Get Heading up to 7
             */
            for (var i = 0; i < 7; i++) {
                var heading = $(`h${i + 1}`, section);
                if (heading.length) {
                    contentStr += `${"#".repeat(i + 1)} ${heading.text()}\n`;
                    $(heading).remove();
                }
            }
            
            let paragraphes = $('p', section);
                paragraphes.map((index, paragraph) => {
                    let paragraphStr = $(paragraph).clone().wrap("<div/>").parent().html().trim();
                    contentStr += paragraphStr;
                    $(paragraph).remove();
            });
            contentFile = contentPath + path.sep + sectionName + ".md";
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
                var settingFile = settingsPath + path.sep + sectionName + '.json';
                fs.writeFileSync(settingFile, JSON.stringify(settings, null, 2));
            }

            let styleStr = "";
            let styleFile = stylePath + path.sep + sectionName + '.module.sass';
            fs.writeFileSync(styleFile, styleStr);

            var sectionStr = $($container)
            .clone()
            .wrap("<div/>")
            .html()
            .replace(/class=\"/g, "className=\"")
            .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, "") // remove comments
            ;

            var sectionFile = sectionName + '.js';

            let bodyStr = `
import cx from "classnames";            
// import styles from "../../styles/${name}/${sectionName}.module.sass";
import Section from "../common/section";
import Container from "../common/container";
export default function ({ content, settings, children, className, ...rest }) {
    settings = settings || {};
    settings.styles = settings.styles || {};
    return (
        <Section className={cx(styles.section, className, settings.styles.section)} {...rest}>
        <Container className={cx(styles.container, settings.styles.section)}>
            ${sectionStr}
        </Container>
        </Section>
    );
    }            
            `;

            fs.writeFileSync(componentPath + path.sep + sectionFile, bodyStr);
         }
         // });
 
     }
     else {
        bodyStr += bodyElem.html();
     }
     let layoutStr = "";
     sectionNames.map((sectionName, index) => {
        layoutStr += `
            <Section${index} content={section${index}.content} settings={section${index}.settings} />\n`;
        });

    let propsStr = "";
    sectionNames.map((sectionName, index) => {
        propsStr += `
        const section${index} = await getContentAndSettings('${name}', '${sectionName}');\n`;
    });

    let partFile = partsPath + path.sep /* + name */ + 'index' + '.js';
    pageStr += `
import Footer from "../components/common/footer";
export default function ${name.charAt(0).toUpperCase()}${name.substr(1)}({
        settings,
        ${sectionNames.join(', \n\t\t\t\t')}
}) {
    return (
        <Layout settings={settings}>
            ${layoutStr}
            <Footer settings={settings} />
        </Layout>
    );
}

export async function getStaticProps() {
    const settings = await getSiteSettings();

    ${propsStr}
  
    return {
      props: {
        settings,
        ${sectionNames.join(', \n\t\t\t\t')}
      }
    };
  }
     `
     fs.writeFileSync(partFile, pageStr);    
}

util.inherits(NextJs, Engine);

module.exports = NextJs;