const mdToHtml = require( `../md-to-html` );

test( `Converts # to headers`, () => {
    expect( mdToHtml( `# This is a header\n\nThis is not.\nNew line.\n\n> # Hello\n>\n> This is a quote\n>\n> This is another quote line.\n>\n>> ## Inner Quote\n>>\n>> This is an inner quote\n>\n> Back out ’gain\n\nThis is after the quote.` ) )
        .toBe( `<h1>This is a header</h1><p>This is not.<br />New line.</p><blockquote><h1>Hello</h1><p>This is a quote</p><p>This is another quote line.</p><blockquote><h2>Inner Quote</h2><p>This is an inner quote</p></blockquote><p>Back out ’gain</p></blockquote><p>This is after the quote.</p>` );
});