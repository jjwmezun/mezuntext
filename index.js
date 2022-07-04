const express = require( `express` );
const app = express();
const port = 3000;
const fs = require( `fs` );
const mdToHtml = require( `./md-to-html` );

const getChapterString = ( chapter ) => chapter.toString().padStart( 3, `0` );

const slugFromURL = ( url ) => {
    const list = url.split( `.` );
    list.pop();
    return list.join( `` );
};

module.exports = ( docs, assets ) => {
    if ( assets ) {
        app.use( express.static( assets ) );
    }

    if ( !docs ) {
        throw `No docs directory set. Server can’t run.`;
    }

    app.get( `/:chapter/`, ( req, res ) => {
        const data = fs.readFileSync( `${ docs }/${ req.params.chapter }.md` );
        let text = `<!DOCTYPE html><html lang="en"><head></head><body>${ mdToHtml( data.toString() ) }`;

        const nav = [];
        const chaps = fs.readdirSync( docs );
        for ( let i = 0; i < chaps.length; ++i ) {
            if ( chaps[i] === `${req.params.chapter}.md` ) {
                if ( i > 0 ) {
                    nav.push({ text: `⇤ 1st Chapter`, link: `/${ slugFromURL( chaps[ 0 ] ) }/` });
                    nav.push({ text: `← Previous Chapter`, link: `/${ slugFromURL( chaps[ i - 1 ] ) }/` });
                }
                if ( i < chaps.length - 1 ) {
                    nav.push({ text: `Next Chapter →`, link: `/${ slugFromURL( chaps[ i + 1 ] ) }/` });
                    nav.push({ text: `Last Chapter ⇥`, link: `/${ slugFromURL( chaps[ chaps.length - 1 ] ) }/` });
                }
                break;
            }
        }

        if ( nav.length !== 0 ) {
            text += `<nav>
                <ul>
                    ${ nav.reduce( ( text, item ) => `${ text }<li><a href="${ item.link }">${ item.text }</a></li>`, `` ) }
                </ul>
            </nav>`;
        }

        text += `</body></html>`;

        res.send( text );
    });

    app.get( `*`, ( req, res ) => {
        res.redirect( 301, `/001/` );
    });

    app.listen( port, () => {
        console.log( `Listening on port ${port}…` );
    });
};