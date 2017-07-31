//
// Konfiguracia slack bota
//
module.exports = {

    // Zdroje restauracii
    sources: {
        // identifikator restauracie 
        kusokstastia: {
            // nazov restauracie
            name: 'Kúsok Šťastia',
            // url pre parsovanie obsahu denneho menu
            web: 'https://www.bistro.sk/kusok-stastia/',
            // druh parsra
            parser: 'parserBistro',
            // pomocne premenne cas a polozky parsovania
            timestamp: 0,
            items: []
        },
        kazacok: {
            name: 'Kazačok Pub',
            web: 'https://www.bistro.sk/kazacok-pub/',
            parser: 'parserBistro',
            timestamp: 0,
            items: []
        },
        smrekovakoliba: {
            name: 'Smreková Koliba',
            web: 'https://restauracie.sme.sk/restauracia/smrekovakoliba_6066-zilina_2737/denne-menu',
            parser: 'parserRestauracieSme',
            timestamp: 0,
            items: []
        },
        vulcano: {
            name: 'Vulcano',
            web: 'https://restauracie.sme.sk/restauracia/vulcano_4536-zilina_2737/denne-menu',
            parser: 'parserRestauracieSme',
            timestamp: 0,
            items: []
        },
        milano: {
            name: 'Pizza Milano',
            web: 'https://www.bistro.sk/pizza-milano/',
            parser: 'parserBistro',
            timestamp: 0,
            items: []
        }
    },

    // ikonky pre hlasovanie (max 10)
    "MAX_VOTE_EMOJIS": [
        ":one:",
        ":two:",
        ":three:",
        ":four:",
        ":five:",
        ":six:",
        ":seven:",
        ":eight:",
        ":nine:",
        ":keycap_ten:"
    ],

    // otazky pre vyvolanie hlasovania (ankety)
    "QUESTION_RECOMENDED": [
        "(kam)",
        "(ktore)(?!.*jedlo)",
        "d(a|á)m?e.*?(obed)",
        "(obed\?)"
    ],

    // otazky pre pozdravenie bota
    "GREETING_QUESTIONS": [
        "[cč]a[uw]",
        "[čc]us",
        "ahoj",
        "zdar"
    ],

    // odpoved bota pre otazku pozdravenia (vybera sa nahodne)
    "GREETING_ANSWERS": [
        "Čau",
        "Čus",
        "Ahoj",
        "Zdar",
        "Čau. Ako sa máš?",
        "Jé čau. Ani som ťa nevidel prichádzať.",
        "Buď pozdravený, soud... ehm... kamarát."
    ],

    // @todo "(aka je) ponuka pre kazacov?"
    // @todo "(ake je) menu v kazacku"
    // @todo "(aka je) ponuka pre kazacok"
    // @todo "(ake je) denne menu pre kazacok"
    "QUESTION_BY_RESTAURANT": [
        "(?=[cč]o.*(?=hraj[úu]|maj[úu]|d[aá]vaj[úu]|varia|je.*na.*obed|je)).*[v|vo]*.*(k[uú]sku|kaza[cč]ku|vul[ck][aá]n[eo]|kolib[a|e]|kolibke|milan[eo])"
    ],

    // pole "vtipnych" gif obrazkov pre zobrazenie v ankete
    "RESTAURANT_GIF": [
        "http://media1.giphy.com/media/K5CULzwBU03HG/giphy.gif",
        "https://media.giphy.com/media/10Z7cLDWDoct9u/giphy.gif",
        "http://pa1.narvii.com/5859/faea324ea73a6a6e7a626361196682b4cba47c70_hq.gif",
        "https://media.giphy.com/media/eSQKNSmg07dHq/giphy.gif",
        "https://media.giphy.com/media/KTW9FIyPKTFcI/giphy.gif"
    ],

    // denne menu konkretnej restauracie 
    // otazka typu "co je v kazacku" alebo "co maju vo vulkane"
    "RESTAURANTS": [
        {
            "regex": "k[uú]sku|k[uú]sok",
            "source": "kusokstastia"
        },
        {
            "regex": "kaza[cč]ku|kaza[cč]ok[ pub]*]",
            "source": "kazacok"
        },
        {
            "regex": "kolibke|kolibe",
            "source": "smrekovakoliba"
        },
        {
            "regex": "vul[ck]an[eo]",
            "source": "vulcano"
        },
        {
            "regex": "milan[oe]",
            "source": "milano"
        }
    ],

    // otazka pre denne menu vsetkych restauracii
    "QUESTION_RESTAURANTS": [
        "([cč]o.*(hraj[úu]|maj[úu]|d[aá]vaj[úu]|je.*na.*obed))",
        "ak[eé].*s[uú].*ponuky[\\?]*",
        "ak[aá].*je.*ponuka"
    ]

};

