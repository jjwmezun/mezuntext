const convertStringQuotes = ( text, inQuote, parent ) => {
    const genQuote = ( start, end, endQuote, startQuote ) => {
        const atts = {};
        const classes = [];
        if ( endQuote ) {
            classes.push( `quote-no-end` );
        }
        if ( startQuote ) {
            classes.push( `quote-no-start` );
        }
        if ( classes.length !== 0 ) {
            atts.class = classes.join( ` ` );
        }
        return {
            tag: `q`,
            atts: atts,
            content: text.substring( start, end ),
            parent: parent
        };
    };

    const data = [];
    let i = 0;
    let j = 0;
    let start = 0;
    while ( i < text.length ) {
        const startQuote = inQuote;
        if ( text[ i ] === `<` || inQuote ) {
            inQuote = true;
            j = i;
            while ( j < text.length ) {
                if ( text[ j ] === `>` ) {
                    ++j;
                    inQuote = false;
                    break;
                }
                ++j;
            }

            if ( i > start ) {
                data.push( text.substring( start, i ) );
            }
            data.push( genQuote( i, j, inQuote, startQuote ) );

            start = j;
            i = j;
        }
        ++i;
    }
    if ( data.length !== 0 && j < text.length ) {
        data.push( text.substring( j ) );
    }

    return { content: data.length === 0 ? text : data, inQuote: inQuote };
};

module.exports = {
    convertStringQuotes: convertStringQuotes,
    convertListQuotes: ( list, inQuote, parent ) => {
        const newList = [];
        let item = ``;
        for ( let i = 0; i < list.length; ++i ) {
            if ( typeof list[ i ] === `object` ) {
                if ( item !== `` ) {
                    newList.push( item );
                    item = ``;
                }
                newList.push( list[ i ] );
            }
            else if ( typeof list[ i ] === `string` ) {
                item += list[ i ];
            }
        }
        if ( item !== `` ) {
            newList.push( item );
        }

        let content = [];
        for ( let i = 0; i < newList.length; ++i ) {
            const out = convertStringQuotes( newList[ i ], inQuote, parent );
            console.log(out);
            inQuote = out.inQuote;
            out.content.forEach( i => content.push( i ) );
        }
        return { content: content, inQuote: inQuote };
    },
    convertTagQuotes: ( tag, inQuote ) => {
        let content;
        if ( Array.isArray( tag.content ) ) {

        }
        else if ( typeof tag.content === `string` ) {
            const out = convertStringQuotes( tag.content, inQuote, tag );
            inQuote = out.inQuote;
            content = out.content;
        }
        return {
            content: {
                tag: tag.tag,
                atts: tag.atts,
                content: content,
                parent: tag.parent
            },
            inQuote: inQuote
        };
    }
};