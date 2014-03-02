/**
 *  lord.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.lord'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityLord = ig.global.EntityBase_player.extend({
        name: 'Roy',

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.0,
            skl: 0.5,
            def: 0.25,
            res: 0.3,
            spd: 0.4,
            luk: 0.6
        },

        animSheet: new ig.AnimationSheet('media/units/players/roy.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 18;
            this.health = 18;
            this.stat.atk = 5;
            this.stat.mag = 0;
            this.stat.skl = 5;
            this.stat.def = 5;
            this.stat.res = 0;
            this.stat.spd = 7;
            this.stat.luk = 7;
            this.stat.mov = 5;

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
