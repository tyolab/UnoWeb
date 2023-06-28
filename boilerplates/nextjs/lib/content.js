import cheerio from "cheerio";
import fs from "fs-extra";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");
const settingsDirectory = path.join(process.cwd(), "settings");

const postsDirectory = path.join(contentDirectory, "posts");

const getSettingsJson = async (src) => {
  const filePath = path.join(settingsDirectory, src);

  if (!fs.existsSync(filePath)) {
    console.debug("getSettingsJson: " + filePath + " does not exist");
    return {};
  }

  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data || {});
};

const getContentJson = async (src) => {
  const filePath = path.join(contentDirectory, src);

  if (!fs.existsSync(filePath)) {
    console.debug("getContentJson: " + filePath + " does not exist");
    return {};
  }

  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data || {});
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

  const fileContents = await fs.readFile(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
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
  let content = await getMarkdown("footer.md");
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
  const markdown = await getMarkdown(pageName + "/" + sectionName + ".md");
  const settings = await getSettingsJson(pageName + "/" + sectionName + ".json");
  const smallText = await getContentJson(pageName + "/" + sectionName + ".json");
  const content = { ...markdown, ...smallText };
  return { content, settings };
}

export async function getHero() {
  return getMarkdown("hero.md");
}

export async function getAbout() {
  return getMarkdown("about.md");
}

/* Posts */

export async function getPostIds() {
  const fileNames = await fs.readdir(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, "")
      }
    };
  });
}

export async function getPosts() {
  const fileNames = await fs.readdir(postsDirectory);
  const items = [];

  for (const fileName of fileNames) {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const matterResult = matter(fileContents);
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();
    items.push({
      id,
      html: contentHtml,
      ...matterResult.data
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

export async function getPostById(id) {
  const fileName = `${id}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    id,
    html: contentHtml,
    ...matterResult.data
  };
}
