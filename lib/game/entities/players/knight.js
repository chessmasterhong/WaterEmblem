/**
 *  knight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.knight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityKnight = ig.global.EntityBase_player.extend({
        name: 'Owain',
        levelUpStatPercentage: {
            atk: 0.45,
            mag: 0.0,
            skl: 0.4,
            def: 0.55,
            res: 0.35,
            spd: 0.2,
            luk: 0.35
        },

        animSheet: new ig.AnimationSheet('media/units/players/knight.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 19;
            this.health = 19;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
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
