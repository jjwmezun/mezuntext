const isWhiteSpace = ( text ) => /^\s+$/g.test( text )

module.exports = ( md ) => {
    const isStartOfLine = ( i ) => md[ i - 2 ] === `\n` && md[ i - 1 ] === `\n`;
    const data = { tag: `root`, atts: {}, content: [], parent: null };
    let currentTag = data;
    let i = 0;
    let content = ``;
    let state = null;

    let tag = `p`;
    if ( md[ i ] === `#` && isWhiteSpace( md[ i + 1 ] ) ) {
        i += 2;
        tag = `h1`;
    }

    const newTag = { tag: tag, atts: {}, content: [], parent: currentTag };
    currentTag.content.push( newTag );
    currentTag = newTag;

    while ( i < md.length ) {
        if ( isStartOfLine( i ) ) {
            let tag = `p`;

            if ( md[ i ] === `#` && isWhiteSpace( md[ i + 1 ] ) ) {
                i += 2;
                tag = `h1`;
            }

            currentTag.content.push( content.trim() );
            content = ``;
            currentTag = currentTag.parent;
            const newTag = { tag: `p`, atts: {}, content: [], parent: currentTag };
            currentTag.content.push( newTag );
            currentTag = newTag;
        }
        else if ( md[ i ] === `\n` && md[ i - 1 ] !== `\n` && md[ i + 1 ] !== `\n` ) {
            currentTag.content.push( content.trim() );
            currentTag.content.push({ tag: `br`, atts: {}, content: [], parent: currentTag })
            content = ``;
        }

        if ( md[ i ] === `!` && md[ i + 1 ] === `[` ) {
            i+=2;
            let j = i;
            let alt = ``;
            while ( j < md.length && md[ j ] !== `]` ) {
                alt += md[ j ];
                j++;
            }
            j++;
            if ( md[ j ] !== `(` ) {
                throw `Invalid image markdown syntax.`;
            }
            j++;
            let src = ``;
            while ( j < md.length && md[ j ] !== `)` ) {
                src += md[ j ];
                j++;
            }

            currentTag.content.push( content.trim() );
            currentTag.content.push({ tag: `img`, atts: { src: src, alt: alt }, content: [], parent: currentTag })
            content = ``;
            i = j + 1;
            if ( i >= md.length ) {
                break;
            }
        }

        content += md[ i ];
        ++i;
    }
    currentTag.content.push( content.trim() );
    return data;
};