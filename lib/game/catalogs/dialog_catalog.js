ig.module(
    'game.catalogs.dialog_catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
    'use strict';

    ig.global.Dialog_Catalog = ig.Class.extend({
        map0: {
            background: new ig.Image('media/backgrounds/town.png'),
            speaker1: new ig.Image('media/mugshots/players/nino.png'),
            speaker2: new ig.Image('media/mugshots/players/limstella.png'),
            dialog: ['Phrase 1', 'Phrase2']
        },

        map1: {
            background: new ig.Image('media/backgrounds/destroyed_town.png'),
            speaker1: new ig.Image('media/mugshots/players/jaffar.png'),
            speaker2: new ig.Image('media/mugshots/players/emowood.png'),
            dialog: ['Emowood: Why u do dis?', 'Jaffar: ...']
        }
    });
});
