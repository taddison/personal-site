const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("asPostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addCollection("allBlogPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("::page-type:blog-post");
  });

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
    },
  };
};
