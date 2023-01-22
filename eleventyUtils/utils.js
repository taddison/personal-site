const markdownParser = require("markdown-it")();
const Image = require("@11ty/eleventy-img");

function imageRule(tokens, idx, options, env, self) {
  const token = tokens[idx];

  // ![Alt Text](relative/path/to/src.png Image Title)
  const imageSourceFromMarkdown = token.attrGet("src");

  // If the image is an external image, use the original renderer for now
  if (
    imageSourceFromMarkdown.length > 3 &&
    imageSourceFromMarkdown.startsWith("http")
  ) {
    return markdownParser.renderer.rules.image(tokens, idx, options, env, self);
  }

  const alt = token.content;
  const title = token.attrGet("title");

  const htmlOptions = {
    alt,
    loading: "lazy",
    decoding: "async",
  };

  if (title) {
    htmlOptions.title = title;
  }

  const siteInputRoot = "site"; // TODO: is this in the env anywhere?
  const siteDeployRoot = "_site"; // TODO: is this in the env anywhere?
  const urlPath = env.page.url; // /blog/cool-blog-post/
  const outputDir = `./${siteDeployRoot}${env.page.url}`; // ./_site/blog/cool-blog-post/
  const imgSource = `./${siteInputRoot}${urlPath}${imageSourceFromMarkdown}`; // /blog/cool-blog-post/image.png

  const imgOptions = {
    widths: [295, 590, 885, 1180, 1475, 1770],
    formats: ["avif", "webp", "jpeg"],
    urlPath,
    outputDir,
  };

  // This call starts generation of output images - note this is async call but we're not waiting
  // markdown-it does not support async rules
  Image(imgSource, imgOptions);

  // Must call statsSync as Image may not have finished processing
  // See: https://www.11ty.dev/docs/plugins/image/#synchronous-shortcode
  const metadata = Image.statsSync(imgSource, imgOptions);

  const generated = Image.generateHTML(metadata, {
    sizes: "(max-width: 768px) 100vw, 768px",
    ...htmlOptions,
  });
  return generated;
}

async function shareImageShortcode(src) {
  const { url } = this.page;

  // TODO - put these in the file globally, infer from environment, other?
  const siteRoot = "_site";
  const imageSrc = "./site" + url + src;
  let metadata = await Image(imageSrc, {
    widths: [600],
    formats: ["jpeg"],
    urlPath: url,
    outputDir: `./${siteRoot}/${url}`,
  });

  // array of image widths - we only asked for one
  let data = metadata.jpeg[0];
  return data.url;
}

module.exports = { imageRule, shareImageShortcode };
