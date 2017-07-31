'use strict';

// require libraries
require('dotenv').load();
const Config = require('./config');
const Scraper = require('./scraper');
const Chance = require('chance');

// check .env file
if (!process.env.SLACK_API_TOKEN) {
    console.log('Error: Specify slack token in environment');
    process.exit(1);
}

// init main libraries
var scraper = new Scraper();
const chance = new Chance();

// init botkit
var Botkit = require('botkit/lib/Botkit.js');
var controller = Botkit.slackbot({
    debug: process.env.SLACKBOT_DEBUG === 'TRUE'
});
controller.spawn({
    token: process.env.SLACK_API_TOKEN
}).startRTM();

/**
 * Random greeting
 */
controller.hears(
    Config.GREETING_QUESTIONS,
    ['direct_message', 'direct_mention', 'mention', 'ambient'],
    function (bot, message) {
        bot.reply(message, Config.GREETING_ANSWERS[chance.natural({
            min: 0,
            max: Config.GREETING_ANSWERS.length - 1
        })]);
    }
);

/**
 * Question for restaurants
 */
controller.hears(
    Config.QUESTION_BY_RESTAURANT,
    ['direct_message', 'direct_mention', 'mention', 'ambient'],
    function (bot, message) {
        bot.reply(message, {type: 'typing'});
        var hit = message.match[1];
        var idSource;
        let rests = Config.RESTAURANTS;
        for (let i = 0; i <= rests.length - 1; i++) {
            if (hit.search(new RegExp(rests[i].regex, 'i')) > -1) {
                idSource = rests[i].source;
                break;
            }
        }

        scraper.getMenue(idSource).then(function (result) {
            if (result.items.length === 0) {
                bot.reply(message, 'Pre ' + result.name + ' dnes nemám žiadnu ponuku :(');
            } else {
                var items = [];
                for (var i = 0; i < result.items.length; i++) {
                    let name = result.items[i].name;
                    let price = result.items[i].price;
                    items.push(name + (price !== '' ? ' - *' + price + '*' : ''));
                }
                bot.reply(message, {
                    text: 'Aktuálna ponuka pre ' + result.name,
                    attachments: [{
                        fallback: 'Denné menu pre ' + result.name + ': ' + result.web,
                        title: result.name,
                        title_link: result.web,
                        text: items.join('\n'),
                        mrkdwn_in: ['text']
                    }]
                });
            }
        }).catch(() => bot.reply(message, 'Prepac, nieco se pokazilo a nemozem najst ponuku.'));
    }
);

/**
 * Question for menues
 */
controller.hears(
    Config.QUESTION_RESTAURANTS,
    ['direct_message', 'direct_mention', 'mention', 'ambient'],
    function (bot, message) {
        bot.reply(message, {type: 'typing'});
        scraper.getAllMenus().then(function (results) {
            var menues = [];
            for (var key in results) {
                if (results.hasOwnProperty(key)) {
                    var items = [];
                    for (var i = 0; i < results[key].items.length; i++) {
                        let name = results[key].items[i].name;
                        let price = results[key].items[i].price;
                        items.push(name + (price !== '' ? ' - *' + price + '*' : ''));
                    }
                    if (items.length > 0) {
                        menues.push({
                            fallback: 'Denné menu pre ' + results[key].name + ': ' + results[key].web,
                            title: results[key].name,
                            title_link: results[key].web,
                            text: items.join('\n'),
                            mrkdwn_in: ['text']
                        });
                    }
                }
            }
            if (menues.length > 0) {
                bot.reply(message, {
                    text: 'Takto vypadá aktuálna ponuka',
                    attachments: menues
                });
            } else {
                bot.reply(message, 'Bohuzial pre dnesok nemam ziadnu ponuku.');
            }
        }).catch((error) => console.log('Error:', error));
    }
);

/**
 * Recomended restaurants
 */
controller.hears(
    Config.QUESTION_RECOMENDED,
    ['direct_message', 'direct_mention', 'mention', 'ambient'],
    function (bot, message) {
        bot.reply(message, {type: 'typing'});
        scraper.getAllMenus().then(function (results) {
            if (Object.keys(results).length === 0) {
                bot.reply(message, 'Dneska ti asi nic neodporucim. Nemam z coho.');
            } else {
                var restaurants = {
                    fallback: [], 
                    text: []
                };

                var i = 0;
                for (var key in results) {
                    if (results.hasOwnProperty(key)) {
                        if (i >= Config.MAX_VOTE_EMOJIS.length) {
                            bot.say(message, 'Hmm... mam nejak viac moznosti co zvladam...');
                            break;
                        }

                        // message
                        if (results[key].items.length > 0) {
                            ++i;
                            restaurants.text.push(Config.MAX_VOTE_EMOJIS[i] + ' ' + results[key].name);
                            restaurants.fallback.push('(' + i + ') ' + results[key].name);
                        }
                    }
                }

                bot.reply(message, {
                    text: Config.RESTAURANT_GIF[chance.natural({
                        min: 0,
                        max: Config.RESTAURANT_GIF.length - 1
                    })]
                });

                bot.reply(message, {
                        text: '>*Kam pôjdeme na obed?*',
                        attachments: [{
                            fallback: restaurants.fallback.join(' | '),
                            color: 'good',
                            text: restaurants.text.join('\n'),
                            mrkdwn_in: ['text']
                        }]
                    }, function (error, json) {
                        if (!error) {
                            var j = 0;
                            do {
                                bot.api.reactions.add({
                                    timestamp: json.ts,
                                    channel: json.channel,
                                    name: Config.MAX_VOTE_EMOJIS[j].replace(/:/gi, '')
                                }, function (err) {
                                    if (err) {
                                        bot.botkit.log('Failed to add emoji reaction ' + Config.MAX_VOTE_EMOJIS[j], err);
                                    }
                                });
                            } while (++j < i);
                        }
                    }
                );
            }
        }).catch(function (err) {
            console.log(err);
            let messages = [
                'som zmateny',
                'nieco mi hapruje pod kapotou'
            ];
            bot.reply(
                message,
                'Chcel som vam pripravit hlasovanie, ale '
                + messages[chance.natural({
                    min: 0,
                    max: messages.length - 1
                })] + '.'
            );
        });
    }
);


/*eslint-disable no-process-exit */
function exitHandler(options, err) {

    var messages = [
        'Kto zakopol o ten kabel? ... ```obed-bot has left the room```'
    ];
    // pre vsetky kanaly kde je bot aktualne pritomny
    // bot.say(messages[0]);

    if (options.cleanup) {
        //console.log('clean');
    }
    if (err) {
        //console.log(err.stack);
    }

    // regularne odpojenie pokail sa ot ukoncil ctrl+c
    if (options.exit) {
        console.log(messages[0]);
        controller.shutdown();
        process.exit();
    }
}

////do something when app is closing
//process.on('exit', exitHandler.bind(null, { cleanup : true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

////catches uncaught exceptions
//process.on('uncaughtException', exitHandler.bind(null, { exit : true }));

