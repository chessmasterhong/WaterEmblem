/**
 *  monk.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.monk'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityMonk = ig.global.EntityBase_player.extend({
        name: 'Lucius',
        levelUpStatPercentage: {
            atk: 0.0,
            mag: 0.6,
            skl: 0.5,
            def: 0.15,
            res: 0.6,
            spd: 0.5,
            luk: 0.5
        },


        animSheet: new ig.AnimationSheet('media/units/players/monk.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 12;
            this.health = 12;
            this.stat.atk = 5;
            this.stat.mag = 5;
            this.stat.skl = 5;
            this.stat.def = 0;
            this.stat.res = 5;
            this.stat.spd = 6;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [15, 16, 17]);
            this.addAnim('down', 0.28, [5, 6, 7]);
            this.addAnim('left', 0.28, [4, 9, 14]);
            this.addAnim('right', 0.28, [10, 11, 12]);
        }
    })
});
