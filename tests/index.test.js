const server = require( `../index` );

test( `Run server without exceptions.`, async () => {
    await expect( () => server( `tests/demo` ) ).not.toThrow();
});