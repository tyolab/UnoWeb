import cheerio from "cheerio";
import fs from "fs";
import path, { format } from "path";
import matter from "gray-matter";

import { serialize } from 'next-mdx-remote/serialize'
// import { bundleMDX } from "mdx-bundler";

import { remark } from "remark";
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
// import {read} from 'to-vfile'
import {unified} from 'unified'
import html from "remark-html";

import { preProcess, postProcess } from "./rehype-pre-raw";

const contentDirectory = path.join(process.cwd(), "content");
const settingsDirectory = path.join(process.cwd(), "settings");

const postsDirectory = path.join(contentDirectory, "posts");

const getSettingsJson = async (src) => {
  const filePath = path.join(settingsDirectory, src);

  if (!fs.existsSync(filePath)) {
    console.debug("getSettingsJson: " + filePath + " does not exist");
    return {};
  }

  const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  try {
    return JSON.parse(data || '{}');
  }
  catch (e) {
    console.debug("getSettingsJson: " + filePath + " is not a valid JSON file");
    return {};
  }
};

const getContentJson = async (src) => {
  const filePath = path.join(contentDirectory, src);

  if (!fs.existsSync(filePath)) {
    console.debug("getContentJson: " + filePath + " does not exist");
    return {};
  }

  const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
  try {
    return JSON.parse(data || '{}');
  }
  catch (e) {
    console.debug("getContentJson: " + filePath + " is not a valid JSON file");
    return {};
  }
};

/**
 * Returning the major text content including title(s) of a markdown file
 * 
 * @param {*} src 
 * @returns 
 */
const getMarkdown = async (src) => {
  const fullPath = path.join(contentDirectory, src);
  if (!fs.existsSync(fullPath)) {
    console.debug("getMarkdown: " + fullPath + " does not exist");
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  // const processedContent = await unified()
  //       .use(html)
  //       .use(remarkParse)
  //       .use(remarkGfm)
  //       .use(remarkRehype)
  //       .use(rehypeStringify)
  //       .process(matterResult.content);

  const contentHtml = processedContent.toString();
  const $ = cheerio.load(contentHtml);

  // we only care headings and paragraphs in the markdown as it would be painful or unfriendly to edit text in other formats like YAML or JSON
  const headings = $("h1, h2, h3, h4, h5, h6");
  const paragraphs = $("p");
  let results = {
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    p: [],
    ...matterResult.data,
  }

  headings.each((i, el) => {
    results[el.tagName.toLowerCase()].push($(el).text());
  });

  paragraphs.each((i, el) => {
    results[el.tagName.toLowerCase()].push($(el).text());
  });

  return results;
};

export async function getHeader(locale) {
  let settings = await getSiteHeader(locale);
  return {
    settings: settings || { styles: {}}
  };
}

export async function getSiteHeader(locale) {
  return await getSettings("header", locale);
}

export async function getFooter() {
  console.debug("get footer");
  let content = await getMarkdown("footer.mdx");
  let settings = await getSiteFooter();
  return {
    content: content,
    settings: settings
  };
}

export async function getSiteFooter() {
  return await getSettings("footer");
}

export async function getSiteMenu() {
  return await getSettings("menu");
}

export async function getSiteSettings() {
  console.debug("get site settings");
  let result = await getSettings("settings");
  const { theme, md, fontSize, images } = result.ogImage;
  result.ogImage = `https://og-image.now.sh/${encodeURI(
    result.title
  )}.png?theme=${theme}&md=${md}&fontSize=${fontSize}&images=${encodeURI(
    images
  )}`;
  return result;
}

export async function getSettings(pageName) {
  let settingFile = pageName.replace(/\|/g, path.sep) + ".json";

  const result = await getSettingsJson(settingFile);
  // console.log("Json Result: " + result);
  return result || {};
}

export async function getContentAndSettings(pageName, sectionName) {
  console.debug("get content and settings: " + pageName + "/" + sectionName);
  const markdown = await getMarkdown(pageName + "/" + sectionName + ".mdx");
  const settings = await getSettingsJson(pageName + "/" + sectionName + ".json");
  const smallText = await getContentJson(pageName + "/" + sectionName + ".json");
  const content = { ...markdown, ...smallText };
  return { content, settings };
}

export async function getHero() {
  return getMarkdown("hero.mdx");
}

export async function getAbout() {
  return getMarkdown("about.mdx");
}

/* Posts */

export async function getPostIds() {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md[x]?$/, "")
      }
    };
  });
}

// export async function buildPostWithMdxBundler(source) {
//     // Add your remark and rehype plugins here
//     const remarkPlugins = [];
//     const rehypePlugins = [];
  
//     try {
//       return await bundleMDX({
//         source,
//         mdxOptions(options) {
//           options.remarkPlugins = [
//             ...(options.remarkPlugins ?? []),
//             ...remarkPlugins,
//           ];
//           options.rehypePlugins = [
//             ...(options.rehypePlugins ?? []),
//             ...rehypePlugins,
//           ];
  
//           return options;
//         },
//       });
//     } catch (error) {
//       throw new Error(error);
//     }
// }

export async function buildPostWithMdxRemote(source) {
  return await serialize(source, {
    // mdxOptions: {
    //   rehypePlugins: [
    //     preProcess,
    //     // rehypeCodeTitles,
    //     // rehypePrism,
    //     // rehypeBlockquote,
    //     postProcess,
    //   ],
    // },
    // ...
   }
  );
}

export async function buildPost(source) {
  return await buildPostWithMdxRemote(source);
}

export async function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  console.debug("get post count: " + fileNames.length);
  const items = [];

  for (const fileName of fileNames) {
    const id = fileName.replace(/\.md[x]?$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });
    const matterResult = matter(fileContent);

    // meta data only

    // Use remark to convert markdown into HTML string
    // const processedContent = await remark()
    //   .use(html)
    //   .process(matterResult.content);
    // const contentHtml = processedContent.toString();
    let frontmatter = matterResult.data;
    if (frontmatter.date) {
      try {
        frontmatter.date = new Date(frontmatter.date);
      }
      catch (e) {
        console.error(e);
        frontmatter.date = null;
      }
    }

    if (!frontmatter.date) {
      try {
        let fstat = fs.statSync(fullPath);
        frontmatter.date = fstat.mtime;
        console.log("mtime: " + fstat.mtime);
      }
      catch (e) {
        console.error(e);
      }
    }

    frontmatter.date = frontmatter.date.toISOString();

    // let slug = id;
    items.push({
      id,
      slug: id,
      // html: contentHtml,
      ...frontmatter
    });
  }

  return items.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostById(slug) {
  const fileName = `${slug}.mdx`;
  const fullPath = path.join(postsDirectory, fileName);

  const fileContent = fs.readFileSync(fullPath, { encoding: 'utf8', flag: 'r' });
  const matterResult = matter(fileContent);

  let contentHtml = await buildPost(matterResult.content);
  return {
    html: contentHtml,
    frontmatter: {slug, ...matterResult.data}
  };

}
