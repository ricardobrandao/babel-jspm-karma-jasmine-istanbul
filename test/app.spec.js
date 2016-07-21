'use strict';

import App from 'src/app';

describe('hello', () => {

    it('should return Hello Foo', function() {
        expect(new App().hello()).toEqual('Hello, World!');
    });
});
