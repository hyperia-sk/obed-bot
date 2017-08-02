# Obed Slack Bot

[![Build Status](https://travis-ci.org/hyperia-sk/obed-bot.svg?branch=master)](https://travis-ci.org/hyperia-sk/obed-bot)

Slack bot, ktorý na požiadanie kontroluje aktuálnu ponuku denného menu reštaurácií. 

Výsledok zobrazuje v miestnosti alebo v rámci osobnej konverzácie. 

Denné menu získava so stránok bistro.sk a restauracie.sme.sk

## Zoznam základných príkazov:

#### `co je dnes na obed?` vypíše zoznam všetkých reštaurácii spolu s ich denným menu,

![screenshot from 2017-07-31 20-02-14](https://user-images.githubusercontent.com/6382002/28791040-5ee569ea-762b-11e7-875b-69e4f0e00eee.png) 

#### `kam na obed` vyvolá hodnotenie s anketou "Kam pôjdeme na obed?"

![screenshot from 2017-07-31 20-02-34](https://user-images.githubusercontent.com/6382002/28791042-5ef03690-762b-11e7-90cd-7b239dec4c5d.png)

#### `co je v <nazov restauracie>` napríklad `co je v kazacku`, `co je v kusku` pre získanie denného menu pre konkrétnu reštauráciu,

![screenshot from 2017-07-31 20-03-07](https://user-images.githubusercontent.com/6382002/28791041-5eeb4450-762b-11e7-9fe0-a3220ed9017e.png)

#### `ahoj` `cau` `zdar` `cus` pre slušné pozdravenie bota


## Inštalácia 

#### Krok 1.

```bash
git clone https://github.com/hyperia-sk/obed-bot.git && cd obed-bot
```

#### Krok 2.

Pre správne fungovanie slack bota je potrebné získať `SLACK_API_TOKEN`:
- vytvorte si novú [bot integration](https://my.slack.com/services/new/bot)
- uložte `SLACK_API_TOKEN` zo stránky pre úpravu BOTa do vášho nastavenia slack-u ([Custom integrations](https://<name>.slack.com/apps/manage/custom-integrations) > Bots > :pencil2: Edit configuration)
- vytvorte súbor `.env` a vložte doň: `SLACK_API_TOKEN=rofl-01234567890-TokenSlacku`

#### Krok 3.

```js
npm install

# spúšťanie:
npm bot.js start

# prípadne spustenie behu na pozadí:
forever start -w bot.js 
```

#### Krok 4.

pozvite `@<meno-vasho-bota>` do miestnosti alebo otvorte s ním priamu komunikáciu



