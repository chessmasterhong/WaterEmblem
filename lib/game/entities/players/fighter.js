/**
 *  fighter.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.fighter'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityFighter = ig.global.EntityBase_player.extend({
        name: 'Bartre',

        levelUpStatPercentage: {
            atk: 0.6,
            mag: 0.0,
            skl: 0.5,
            def: 0.15,
            res: 0.3,
            spd: 0.3,
            luk: 0.4
        },

        animSheet: new ig.AnimationSheet('media/units/players/fighter.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/bartre.png'),


        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 22;
            this.health = 22;
            this.stat.atk = 9;
            this.stat.mag = 0;
            this.stat.skl = 5;
            this.stat.def = 4;
            this.stat.res = 0;
            this.stat.spd = 3;
            this.stat.luk = 4;
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
