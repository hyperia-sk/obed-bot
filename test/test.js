var assert = require('chai').assert;
var expect = require('chai').expect;
var Config = require('../config');
var Scraper = require('../scraper');

describe('config', function () {

    it('should be object', function () {
        assert.isTrue('object' === typeof Config);
    });

    it('should have config restaurant', function () {
        var rst = Config.sources.kusokstastia;
        assert.equal('Kúsok Šťastia', rst.name);
        assert.isDefined(rst.web);
        assert.isDefined(rst.name);
        assert.isDefined(rst.parser);
        assert.isDefined(rst.timestamp);
        assert.isDefined(rst.items);
    });

    Object.keys(Config).map(function (objectKey, index) {
        it('should have key ' + objectKey, function () {
            assert.isArray(Config.MAX_VOTE_EMOJIS);
            assert.isNotEmpty(Config.MAX_VOTE_EMOJIS);
            assert.isNotEmpty(Config[objectKey]);
        });
    });
});

describe('scraper', function () {
    var scraper;

    beforeEach('init scraper', function () {
        scraper = new Scraper();
    });

    it('should be object', function () {
        assert.instanceOf(scraper, Scraper);
        assert.isObject(scraper);
    });

    it('should have offers', function () {
        assert.isNotEmpty(scraper.offer);
    });

    it('maxAge is higher then zero', function () {
        assert.isTrue(scraper.maxAge > 0);
    });

    it('should day is string', function () {
        assert.isNotEmpty(scraper._getDay());
        assert.isString(scraper._getDay());
    });

    it('scrape menue', function () {
        scraper.getMenue('kusokstastia').then(function (result) {
            assert.isNotEmpty(result.items);
        });
    });
    
    it('download menue', function () {
        scraper.downloadMenu('kusokstastia').then(function (result) {
            assert.isNotEmpty(result.items);
        });
    });

    it('scrape all menues', function () {
        scraper.getAllMenus().then(function (result) {
            assert.isNotEmpty(result.items);
        });
    });
    
    it('should parser bistro empty', function () {
        scraper.parserBistro('', 'kusokstastia');
        assert.equal(scraper.offer.kusokstastia.items[0].name, '\nponuka nebola zverejnená :disappointed:\n');
        assert.equal(scraper.offer.kusokstastia.items[0].price, '');
    });
    
    it('should parser restauracie sme empty', function () {
        scraper.parserRestauracieSme('', 'vulcano');
        assert.equal(scraper.offer.vulcano.items[0].name, '\nponuka nebola zverejnená :disappointed:\n');
        assert.equal(scraper.offer.vulcano.items[0].price, '');
    });

});
