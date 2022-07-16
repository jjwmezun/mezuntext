module.exports = ( text, inQuote, parent ) => {

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
    const startQuote = inQuote;
    while ( i < text.length ) {
        if ( text[ i ] === `<` || inQuote ) {
            inQuote = true;
            let j = i;
            while ( j < text.length ) {
                if ( text[ j ] === `>` ) {
                    ++j;
                    inQuote = false;
                    break;
                }
                ++j;
            }

            if ( i > 0 ) {
                data.push( text.substring( 0, i ) );
            }
            data.push( genQuote( i, j, inQuote, startQuote ) );
            if ( j < text.length ) {
                data.push( text.substring( j ) );
            }

            i = j;
        }
        ++i;
    }

    return { content: data.length === 0 ? text : data, inQuote: inQuote };
};