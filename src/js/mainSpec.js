define(function (require) {
    'use strict';
    var main = require('./main');
    describe('The pork game', function () {
       it('should have a main file', function () {
           expect(main).not.toBeNull();
       });
    });
});