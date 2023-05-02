const { parse } = require('csv-parse/sync');
const PostCSSPlugin = require("eleventy-plugin-postcss");

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/favicon.ico');
  eleventyConfig.addPassthroughCopy('src/manifest.webmanifest');
  eleventyConfig.addPassthroughCopy('src/img');
  //eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/js');
  
  eleventyConfig.addFilter("toJson", arr => {
    return JSON.stringify(arr);
  });

  eleventyConfig.addDataExtension("csv", (contents, filePath) => {
    return parse(contents, {
      columns: true,
      skip_empty_lines: true
    });
  });

  eleventyConfig.setServerOptions({
    showAllHosts: true
  })

  eleventyConfig.addPlugin(PostCSSPlugin);

  return {
    dir: {
      input: "src"
    }
  }
}