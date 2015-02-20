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
                background: new ig.Image('media/backgrounds/town.png'),
                speaker1: new ig.Image('media/mugshots/players/nino.png'),
                speaker2: new ig.Image('media/mugshots/players/limstella.png'),
                dialog: ['Phrase 1', 'Phrase 2']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/town.png'),
                speaker1: new ig.Image('media/mugshots/players/nino.png'),
                speaker2: new ig.Image('media/mugshots/players/limstella.png'),
                dialog: ['Phrase 3', 'Phrase 4']
            }
        },

        1: {
            prebattle: {
                background: new ig.Image('media/backgrounds/destroyed_town.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/emowood.png'),
                dialog: ['Phrase 5', 'Phrase 6']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/destroyed_town.png'),
                speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
                speaker2: new ig.Image('media/mugshots/players/emowood.png'),
                dialog: ['Phrase 7', 'Phrase 8']
            }
        },

        2: {
            prebattle: {
                background: new ig.Image('media/backgrounds/town.png'),
                speaker1: new ig.Image('media/mugshots/players/nino.png'),
                speaker2: new ig.Image('media/mugshots/players/limstella.png'),
                dialog: ['Phrase 9', 'Phrase 10']
            },
            postbattle: {
                background: new ig.Image('media/backgrounds/town.png'),
                speaker1: new ig.Image('media/mugshots/players/nino.png'),
                speaker2: new ig.Image('media/mugshots/players/limstella.png'),
                dialog: ['Phrase 11', 'Phrase 12']
            }
        }
    });
});
