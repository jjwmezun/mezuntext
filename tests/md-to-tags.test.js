const mdToHtml = require( `../md-to-html` );

test( `Converts # to headers`, () => {
    expect( mdToHtml( `# This is a header\n\nThis is not.\nNew line.` ) ).toBe( `<h1>This is a header</h1><p>This is not.<br />New line.</p>` );
});