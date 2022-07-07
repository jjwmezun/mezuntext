const path = require( `path` );
const pug = require( `pug` );

let templates = {};

module.exports = ( template, data ) => {
    if ( !( template in templates ) ) {
        templates[ template ] = pug.compileFile( path.join( __dirname, `views/${ template }.pug` ) );
    }
    return templates[ template ]( data );
}