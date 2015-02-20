ig.module(
    'game.catalogs.dialog_catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
    'use strict';

    ig.global.Dialog_Catalog = ig.Class.extend({
        0: {
            prebattle: {
                background: new ig.Image('media/backgrounds/mountain_trail.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/emowood.png'),
                dialog: ['Emowood: Why Jaffar? Why would you turn on us?', 'Jaffar: ...']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/town.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/hector.png'),
                dialog: ['Hector: You traitorous fiend!', 'Jaffar: You were all just corpses to me.']
            }
        },

        1: {
            prebattle: {
                background: new ig.Image('media/backgrounds/snow_forest.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/nergal.png'),
                dialog: ['Nergal: Is that you Jaffar?', 'Jaffar: Your time is up.', 
                         'Nergal: I was the one that turned you into the Angel \nof Death.', 
                         'Nergal: You dare turn on me?', 'Jaffar: Now it is my time.']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/cool_throne.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/nergal_cutscene.png'),
                dialog: ['Nergal: I cannot believe you have bested me in battle. \nYou finally ---', 'Jaffar: Die.', 'Nergal: Gah...']
            }
        },

        2: {
            prebattle: {
                background: new ig.Image('media/backgrounds/castle.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/zephiel.png'),
                dialog: ['King Zephiel: Who dares enter my presence?', 'Jaffar: The Angel of Death.', 
                         'King Zephiel: You will pay for your insolence with your life!']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/castle2.png'),
                speaker1: new ig.Image('media/mugshots/players/nino.png'),
                speaker2: new ig.Image('media/mugshots/players/limstella.png'),
                dialog: ['Phrase 11', 'Phrase 12']
            }
        }
    });
});
