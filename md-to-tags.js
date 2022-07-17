const testHeader = ( block ) => {
    for ( let i = 6; i > 0; --i ) {
        if ( new RegExp( `^#{${ i }}` ).test( block[ 0 ] ) ) return i;
    }
    return null;
}

const testIndent = ( line ) => {
    for ( let i = 2; i > 0; --i ) {
        if ( new RegExp( `^>{${ i }}` ).test( line ) ) return i;
    }
    return 0;
};

const removeIndent = ( line ) => line.replace( /^[>]+[\s]*/, `` );

module.exports = ( md ) => {
    const megaBlocks = [];
    const lines = md.split( `\n` );
    let prevIndent = null;
    lines.forEach( line => {
        const indent = testIndent( line );
        if ( prevIndent === null || prevIndent !== indent ) {
            megaBlocks.push({
                indent: indent,
                lines: []
            });
        }
        prevIndent = indent;

        megaBlocks[ megaBlocks.length - 1 ].lines.push( removeIndent( line ) );
    });

    megaBlocks.forEach( megaBlock => {
        megaBlock.blocks = [[]];
        megaBlock.lines.forEach( line => {
            if ( /^\s*$/g.test( line ) ) {
                megaBlock.blocks.push([]);
            }
            else {
                megaBlock.blocks[ megaBlock.blocks.length - 1 ].push( line );
            }
        });

        // Remove empty lists.
        if ( megaBlock.blocks[ megaBlock.blocks.length - 1 ].length === 0 ) {
            megaBlock.blocks.pop();
        }
        if ( megaBlock.blocks[ 0 ].length === 0 ) {
            megaBlock.blocks = megaBlock.blocks.slice( 1 );
        }

        delete megaBlock.lines;
    });

    const root = { tag: `root`, atts: {}, content: [], parent: null };
    let parent = root;

    prevIndent = 0;
    megaBlocks.forEach( megaBlock => {
        if ( megaBlock.indent > prevIndent ) {
            for ( let i = megaBlock.indent; i > prevIndent; --i ) {
                const element = {
                    tag: `blockquote`,
                    atts: {},
                    content: [],
                    parent: parent
                };
                parent.content.push( element );
                parent = element;
            }
        }
        else if ( megaBlock.indent < prevIndent ) {
            for ( let i = megaBlock.indent; i < prevIndent; ++i ) {
                parent = parent.parent;
            }
        }
        prevIndent = megaBlock.indent;

        megaBlock.blocks.forEach( block => {
            let tag = `p`;
            const headerLevel = testHeader( block );
            if ( headerLevel ) {
                tag = `h${ headerLevel }`;
                block[ 0 ] = block[ 0 ].replace( /^#{0,6}[\s]/, `` );
            }

            const element = {
                tag: tag,
                atts: {},
                content: ``,
                parent: parent
            };

            let content = block[ 0 ].trim();
            if ( block.length > 1 ) {
                content = [ block[ 0 ].trim() ];
                for ( let i = 1; i < block.length; ++i ) {
                    content.push({
                        tag: `br`,
                        atts: {},
                        content: ``,
                        parent: element
                    });
                    content.push( block[ i ].trim() );
                }
            }

            element.content = content;
            parent.content.push( element );
        });

    });

    return root;
};