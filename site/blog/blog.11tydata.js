module.exports = {
  layout: "post.njk",
  tags: ["page-type:blog"],
  eleventyComputed: {
    title: (data) => `${data.title} | tjaddison.com`,
  },
};
