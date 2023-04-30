const { parse } = require('csv-parse/sync');

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('img');
  eleventyConfig.addPassthroughCopy('css');
  eleventyConfig.addPassthroughCopy('assets');
  eleventyConfig.addPassthroughCopy('js');
  
  eleventyConfig.addFilter("toJson", arr => {
    return JSON.stringify(arr);
  });

  eleventyConfig.addDataExtension("csv", (contents, filePath) => {
    return parse(contents, {
      columns: true,
      skip_empty_lines: true
    });
  });
}