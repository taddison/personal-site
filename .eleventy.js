const { DateTime } = require("luxon");
const markdownParser = require("markdown-it")();
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const { imageRule, shareImageShortcode } = require("./eleventyUtils/utils");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("asPostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("removeMetaTags", (tagArray) => {
    return tagArray.filter((tag) => !tag.startsWith("::"));
  });

  eleventyConfig.addFilter("removeWhitespace", (string) => {
    return string.replace(/\s/g, "");
  });

  eleventyConfig.addCollection("allBlogPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("::page-type:blog-post");
  });

  eleventyConfig.addCollection("blogPostsByYear", function (collectionApi) {
    const blogPosts = collectionApi.getFilteredByTag("::page-type:blog-post");

    const years = blogPosts.map((blogPost) => blogPost.date.getFullYear());
    const uniqueYears = Array.from(new Set(years));

    const postsByYear = uniqueYears.reduce((acc, year) => {
      const blogPostsForYear = blogPosts.filter(
        (blogPost) => blogPost.date.getFullYear() === year
      );

      acc.push([year, blogPostsForYear]);
      return acc;
    }, []);

    return postsByYear;
  });

  // TODO: Filtered tags for blog post - shared function/reusable
  // TODO: Filtering logic to remove 'meta' tags - shared functional/reusable
  eleventyConfig.addCollection("blogPostsByTag", function (collectionApi) {
    const blogPosts = collectionApi
      .getFilteredByTag("::page-type:blog-post")
      .reverse();

    const tags = blogPosts.map((blogPost) => blogPost.data.tags).flat();
    const uniqueTags = Array.from(new Set(tags));
    const filteredTags = uniqueTags.filter((tag) => !tag.startsWith("::"));

    const postsByTagMap = new Map(
      filteredTags.map((tag) => {
        return [tag, []];
      })
    );

    for (const post of blogPosts) {
      for (const tag of post.data.tags) {
        if (!filteredTags.includes(tag)) {
          continue;
        }
        postsByTagMap.get(tag).push(post);
      }
    }

    const postsByTag = Array.from(postsByTagMap).sort();
    return postsByTag;
  });

  // https://www.11ty.dev/docs/copy/
  eleventyConfig.addPassthroughCopy({ static: "." });
  eleventyConfig.addPassthroughCopy("site/blog/**/*.{json,pbit,pbix,xlsx,sql}");

  markdownParser.renderer.rules.image = imageRule;

  // https://www.npmjs.com/package/markdown-it-anchor#permalinks
  markdownParser.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({
      class: "hover:after:content-['_🔗'] text-inherit",
    }),
    level: [1, 2, 3, 4],
    slugify: eleventyConfig.getFilter("slugify"),
  });

  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.setLibrary("md", markdownParser);

  eleventyConfig.addNunjucksAsyncShortcode(
    "shareImageUri",
    shareImageShortcode
  );

  eleventyConfig.addPlugin(pluginRss);
  // https://www.11ty.dev/docs/plugins/syntaxhighlight/
  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
    },
  };
};
