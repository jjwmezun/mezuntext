const inlineTags = [
    `br`
];

const sanitize = ( text ) => text.replace( /</g, `&lt;` ).replace( />/g, `&gt;` );

const tagsToHtml = ( tag ) => {
    if ( typeof tag !== `object` || tag === null ) {
        return ``;
    }
    let text = ``;
    // Render tag head.
    if ( tag.tag !== `root` ) {
        text += `<${ tag.tag }`;
        // Render tag attributes.
        for ( const key in tag.atts ) {
            // If true, just render attribute key without value.
            if ( tag.atts[ key ] === true ) {
                text += ` ${ key }`;
            }
            else {
                text += ` ${ key }="${ tag.atts[ key ] }"`;
            }
        }

        if ( inlineTags.includes( tag.tag ) ) {
            text += ` /`;
        }

        text += `>`;
    }

    if ( !inlineTags.includes( tag.tag ) ) {
        // Recursively render content.
        switch ( typeof tag.content ) {
            case ( `object` ): {
                tag.content.forEach( ( content ) => {
                    if ( typeof content === `string` ) {
                        text += sanitize( content );
                    }
                    else { // Is tag.
                        text += tagsToHtml( content );
                    }
                });
            }
            break;
            case ( `string` ): {
                text += sanitize( tag.content );
            }
            break;
        }
        // Render tag tail.
        if ( tag.tag !== `root` ) {
            text += `</${ tag.tag }>`;
        }
    }

    return text;
};

module.exports = tagsToHtml;