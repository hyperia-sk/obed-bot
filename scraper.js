'use strict';

const request = require('request');
const cheerio = require('cheerio');
const encoding = require('encoding');
const fs = require('fs');
const Config = require('./config');
const sources = Config.sources;

/**
 * Initialize Scraper object
 * 
 * @returns {nm$_scraper.Scraper}
 */
function Scraper() {
    this.offer = sources;
    this.maxAge = 3600000;
}

/**
 * Get menue by restaurant
 *
 * @param idSource
 * @returns {Promise}
 */
Scraper.prototype.getMenue = function (idSource) {
    var self = this;
    return new Promise(function (resolve, reject) {
        if (!self.offer.hasOwnProperty(idSource) || self.offer[idSource].timestamp <= Date.now() - self.maxAge) {
            self.downloadMenu(idSource).then(
                () => resolve(self.offer[idSource])
            ).catch(
                () => reject('Pre ' + idSource + ' sa nepodarilo získať ponuku.')
            );
        } else {
            resolve(self.offer[idSource]);
        }
    });
};

/**
 * Get all restaurant menues
 *
 * @returns {Promise}
 */
Scraper.prototype.getAllMenus = function () {
    var self = this;
    var promiseQueue = Object.keys(sources).map(self.getMenue, self);

    return new Promise(function (resolve) {
        var lastPromise = Promise.resolve();
        var resolveWithCurentOffer = () => resolve(self.offer);
        var handleCatchedRejection = (error) => console.log(error);

        for (let i = 0; i <= promiseQueue.length; i++) {
            if (i < promiseQueue.length) {
                lastPromise = lastPromise.then(() => promiseQueue[i]).catch(handleCatchedRejection);
            } else {
                lastPromise.then(resolveWithCurentOffer);
            }
        }
    });
};

/**
 * Download menue by restaurant
 *
 * @param idSource
 * @returns {Promise}
 */
Scraper.prototype.downloadMenu = function (idSource) {
    var self = this;
    return new Promise(function (resolve, reject) {
        var parseMenueData = function (err, body) {
            if (err) {
                reject('nepodarilo se stiahnuť ponuku pre ' + Config.sources[idSource].name, err);
            } else {
                self[Config.sources[idSource].parser](body, idSource);
                resolve(self.offer[idSource]);
            }
        };

        request(
            {
                url: Config.sources[idSource].web, 
                encoding: null
            },
            (err, resp, body) => parseMenueData(err, body)
        );
    });
};

/**
 * Get name of the day for parse menue
 * 
 * @returns {String}
 */
Scraper.prototype._getDay = function() {
    var skDays = [
        'Nedeľa', 
        'Pondelok', 
        'Utorok', 
        'Streda', 
        'Štvrtok', 
        'Piatok', 
        'Sobota'
    ];
    var date = new Date();
    var actualDay = date.getDay();
    var skOffset = date.getHours() > 15 ? actualDay + 1 : actualDay;
    
    return skDays[skOffset];
};

/**
 * Parse daily menue from https://www.bistro.sk
 * 
 * @param {String} buffer
 * @param {Integer} idSource
 * @returns void
 */
Scraper.prototype.parserBistro = function (buffer, idSource) {
    var body = encoding.convert(buffer, 'UTF-8');
    var $ = cheerio.load(body);
    var data = [];
    var skDay = this._getDay();

    var mainSelector = $('.categories a:contains("Denné menu ' + skDay + '")');
    if (mainSelector.length > 0) {
        var selector = mainSelector.attr('href').replace('#', '');

        data.push({
            name: '\nponuka na *' + skDay.toLowerCase() + '*\n',
            price: ''
        });

        $('a#' + selector).parent().next('ul').children('li').each(function (idx, el) {
            var element = $(el);
            data.push({
                name: '\n' + element.find('span.name strong').text().trim() + ' _(' + element.find('span.desc').text().trim() + ')_',
                price: ''
            });
        });

    } else {
        data.push({
            name: '\nponuka nebola zverejnená :disappointed:\n',
            price: ''
        });
    }

    this.offer[idSource]['timestamp'] = Date.now();
    this.offer[idSource]['items'] = data;
};

/**
 * Parse daily menue from https://restauracie.sme.sk"
 * 
 * @param {String} buffer
 * @param {Integer} id
 * @returns void
 */
Scraper.prototype.parserRestauracieSme = function (buffer, id) {
    var body = encoding.convert(buffer, 'UTF-8');
    var $ = cheerio.load(body);
    var data = [];
    var skDay = this._getDay();

    var selector = $('.dnesne_menu .jedlo_polozka');
    if( selector.length > 0 ) {
        data.push({
            name: '\nponuka na *' + skDay.toLowerCase() + '*\n',
            price: ''
        });

        selector.each(function (idx, el) {
            var element = $(el);
            data.push({
                name: '\n' + element.find('div').text().trim(), // + ' _(' + el.find('span.desc').text().trim() + ')_',
                price: element.find('span').text().trim()
            });
        });
    } else {
        data.push({
            name: '\nponuka nebola zverejnená :disappointed:\n',
            price: ''
        });
    }

    this.offer[id]['timestamp'] = Date.now();
    this.offer[id]['items'] = data;
};

module.exports = Scraper;


