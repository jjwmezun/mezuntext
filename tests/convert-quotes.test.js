const convertQuotes = require( `../convert-quotes` );

test( `Converts # to headers`, () => {
    expect( convertQuotes( `Them: <Hello>, said they.`, false, null ) )
        .toStrictEqual({
            content: [
                `Them: `,
                {
                    tag: `q`,
                    atts: {},
                    content: `<Hello>`,
                    parent: null
                },
                `, said they.`
            ],
            inQuote: false
        });

    expect( convertQuotes( `<Hello>, said they.`, false, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: {},
                    content: `<Hello>`,
                    parent: null
                },
                `, said they.`
            ],
            inQuote: false
        });

    expect( convertQuotes( `<Hello>`, false, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: {},
                    content: `<Hello>`,
                    parent: null
                }
            ],
            inQuote: false
        });

    expect( convertQuotes( `What.`, false, null ) )
        .toStrictEqual({
            content: `What.`,
            inQuote: false
        });

    expect( convertQuotes( `They said: <Hello.`, false, null ) )
        .toStrictEqual({
            content: [
                `They said: `,
                {
                    tag: `q`,
                    atts: { class: `quote-no-end` },
                    content: `<Hello.`,
                    parent: null
                }
            ],
            inQuote: true
        });

    expect( convertQuotes( `& that’s the way it is>, she concluded.`, true, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: { class: `quote-no-start` },
                    content: `& that’s the way it is>`,
                    parent: null
                },
                `, she concluded.`
            ],
            inQuote: false
        });

    expect( convertQuotes( `& that’s the way it is.`, true, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: { class: `quote-no-end quote-no-start` },
                    content: `& that’s the way it is.`,
                    parent: null
                }
            ],
            inQuote: true
        });
});