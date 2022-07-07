const express = require( `express` );
const fs = require( `fs` );
const mdToHtml = require( `./md-to-html` );
const path = require( `path` );
const template = require( `./template` );

const port = 3000;
const app = express();

const getChapterString = ( chapter ) => chapter.toString().padStart( 3, `0` );

const slugFromURL = ( url ) => {
    const list = url.split( `.` );
    list.pop();
    return list.join( `` );
};

module.exports = ( docs, assets ) => {
    app.use( `/base/assets`, express.static( path.join( __dirname, `assets` ) ) );
    if ( assets ) {
        app.use( express.static( assets ) );
    }

    if ( !docs ) {
        throw `No docs directory set. Server can’t run.`;
    }

    app.get( `/:chapter/`, ( req, res ) => {
        const data = fs.readFileSync( `${ docs }/${ req.params.chapter }.md` );
        const text = mdToHtml( data.toString() );

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

        res.send( template( `story`, {
            text: text,
            nav: nav
        } ) );
    });

    app.get( `/`, ( req, res ) => {
        const chaps = fs.readdirSync( docs );
        res.send( template( `index`, {
            title: `Table o’ Contents`,
            stories: chaps.length > 0 ? chaps.map( i => { return { url: slugFromURL( i ), title: i } } ) : []
        } ) );
    });

    app.get( `*`, ( req, res ) => {
        res.redirect( 301, `/` );
    });

    app.listen( port, () => {
        console.log( `Listening on port ${port}…` );
    });
};