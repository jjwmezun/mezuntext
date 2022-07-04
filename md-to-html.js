const mdToTags = require(`./md-to-tags.js`);
const tagsToHtml = require( `./tags-to-html` );

module.exports = ( md ) => tagsToHtml( mdToTags( md ) );