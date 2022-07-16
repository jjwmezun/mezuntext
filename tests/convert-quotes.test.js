const {
    convertStringQuotes,
    convertListQuotes,
    convertTagQuotes
} = require( `../convert-quotes` );

test( `Converts # to headers`, () => {
    expect( convertStringQuotes( `Them: <Hello>, said they.`, false, null ) )
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

    expect( convertStringQuotes( `<Hello>, said they.`, false, null ) )
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

    expect( convertStringQuotes( `<Hello>`, false, null ) )
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

    expect( convertStringQuotes( `What.`, false, null ) )
        .toStrictEqual({
            content: `What.`,
            inQuote: false
        });

    expect( convertStringQuotes( `They said: <Hello.`, false, null ) )
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

    expect( convertStringQuotes( `& that’s the way it is>, she concluded.`, true, null ) )
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

    expect( convertStringQuotes( `& that’s the way it is.`, true, null ) )
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

    expect( convertStringQuotes( `That’s just how it is>, they said.& then they said, <Hey, you —— don’t forget>.`, true, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: { class: `quote-no-start` },
                    content: `That’s just how it is>`,
                    parent: null
                },
                `, they said.& then they said, `,
                {
                    tag: `q`,
                    atts: {},
                    content: `<Hey, you —— don’t forget>`,
                    parent: null
                },
                `.`
            ],
            inQuote: false
        });

    
    expect( convertListQuotes([
        `That’s just how it is>, they said.`,
        `& then they said, <Hey, you —`,
        `— don’t forget>.`
    ], true, null ) )
        .toStrictEqual({
            content: [
                {
                    tag: `q`,
                    atts: { class: `quote-no-start` },
                    content: `That’s just how it is>`,
                    parent: null
                },
                `, they said.& then they said, `,
                {
                    tag: `q`,
                    atts: {},
                    content: `<Hey, you —— don’t forget>`,
                    parent: null
                },
                `.`
            ],
            inQuote: false
        });

    
    expect( convertTagQuotes({
        tag: `p`,
        atts: {},
        content: `& that’s the way it is.`,
        parent: null
    }, true ) )
        .toStrictEqual({
            content: {
                tag: `p`,
                atts: {},
                content: [
                    {
                        tag: `q`,
                        atts: { class: `quote-no-end quote-no-start` },
                        content: `& that’s the way it is.`,
                        parent: {
                            tag: `p`,
                            atts: {},
                            content: `& that’s the way it is.`,
                            parent: null
                        }
                    }
                ],
                parent: null
            },
            inQuote: true
        });
});