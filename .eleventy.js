const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("asPostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("removeMetaTags", (tagArray) => {
    return tagArray.filter((tag) => !tag.startsWith("::"));
  });

  eleventyConfig.addCollection("allBlogPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("::page-type:blog-post");
  });

  eleventyConfig.addPassthroughCopy("fonts");

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
    },
  };
};
