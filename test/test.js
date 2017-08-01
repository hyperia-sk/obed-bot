var assert = require('chai').assert;
var expect = require('chai').expect;
var Config = require('../config');
var Scraper = require('../scraper');

describe('config', function() {
    
    it('is config object', function() {
        assert.isTrue('object' === typeof Config);
    });

    it('is set config restaurant', function() {
        var rst = Config.sources.kusokstastia;
        assert.equal('Kúsok Šťastia', rst.name);
        assert.isDefined(rst.web);
        assert.isDefined(rst.name);
        assert.isDefined(rst.parser);
        assert.isDefined(rst.timestamp);
        assert.isDefined(rst.items);
    });
    
    Object.keys(Config).map(function(objectKey, index) {
        it('test key '+objectKey, function() {
            assert.isArray(Config.MAX_VOTE_EMOJIS);
            assert.isNotEmpty(Config.MAX_VOTE_EMOJIS);
            assert.isNotEmpty(Config[objectKey]);
        });
    });
});

describe('scraper', function() {
    var scraper = new Scraper();

    it('is object', function() {
        assert.isObject(scraper);
    });
    
    it('is not empty offer', function(){
        assert.isNotEmpty(scraper.offer);
    });
    
    it('is set max age', function(){
        assert.isTrue(scraper.maxAge > 0);
    });
    
    it('is set actual day', function(){
        assert.isString(scraper._getDay());
    });

    it('scrape menue', function(){
        scraper.getMenue('kusokstastia').then(function (result) {
            
            assert.isNotEmpty(result.items);
            console.log( result.items );
            
        });
    });

});
