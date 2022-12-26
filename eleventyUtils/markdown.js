const Image = require("@11ty/eleventy-img");

// eslint-disable-next-line no-unused-vars
function imageRule(tokens, idx, options, env, self) {
  const token = tokens[idx];

  // ![Alt Text](relative/path/to/src.png Image Title)
  const imageSourceFromMarkdown = token.attrGet("src");
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

  const siteRoot = "_site";
  const urlPath = env.page.url; // /blog/cool-blog-post/
  const outputDir = `./${siteRoot}${env.page.url}`; // ./_site/blog/cool-blog-post/
  const imgSource = `.${urlPath}${imageSourceFromMarkdown}`; // ./_site/blog/cool-blog-post/image.png

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

module.exports = { imageRule };
