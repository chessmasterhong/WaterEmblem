/**
 *  pegasus_knight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.pegasus_knight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityPegasus_knight = ig.global.EntityBase_player.extend({
        name: 'Florina',
        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.4,
            skl: 0.6,
            def: 0.35,
            res: 0.35,
            spd: 0.7,
            luk: 0.6
        },


        animSheet: new ig.AnimationSheet('media/units/players/newPegasusKnight.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 13;
            this.health = 13;
            this.stat.atk = 5;
            this.stat.skl = 8;
            this.stat.mag = 2;
            this.stat.def = 4;
            this.stat.res = 4;
            this.stat.spd = 7;
            this.stat.luk = 3;
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
