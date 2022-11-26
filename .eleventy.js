const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("asPostDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_FULL);
  });

  eleventyConfig.addFilter("removeMetaTags", (tagArray) => {
    return tagArray.filter((tag) => !tag.startsWith("::"));
  });

  eleventyConfig.addCollection("allBlogPosts", function (collectionApi) {
    return collectionApi.getFilteredByTag("::page-type:blog-post").reverse();
  });

  eleventyConfig.addCollection("blogPostsByYear", function (collectionApi) {
    const blogPosts = collectionApi
      .getFilteredByTag("::page-type:blog-post")
      .reverse();

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

  eleventyConfig.addPassthroughCopy("fonts");

  return {
    markdownTemplateEngine: "njk",
    dir: {
      input: "site",
    },
  };
};
