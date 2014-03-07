/**
 *  mercenary.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.mercenary'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityMercenary = ig.global.EntityBase_player.extend({
        name: 'Raven',
        levelUpStatPercentage: {
            atk: 0.55,
            mag: 0.0,
            skl: 0.4,
            def: 0.25,
            res: 0.15,
            spd: 0.45,
            luk: 0.4
        },


        animSheet: new ig.AnimationSheet('media/units/players/mercenary.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/raven.png'),
        modal: new ig.Image('media/modal/raven_modal.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 18;
            this.health = 18;
            this.stat.atk = 7;
            this.stat.mag = 0;
            this.stat.def = 5;
            this.stat.res = 3;
            this.stat.spd = 7;
            this.stat.luk = 5;
            this.stat.mov = 4;

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13, 19]);
            this.addAnim('right', 0.28, [2, 8, 14, 20]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11, 17]);
        }
    })
});
