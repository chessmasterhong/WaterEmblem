/**
 *  pirate.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.pirate'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityPirate = ig.global.EntityBase_player.extend({
        name: 'Dart',
        levelUpStatPercentage: {
            atk: 0.7,
            mag: 0.0,
            skl: 0.3,
            def: 0.25,
            res: 0.15,
            spd: 0.6,
            luk: 0.5
        },


        animSheet: new ig.AnimationSheet('media/units/players/newPirate.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/dart.png'),


        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 12;
            this.health = 12;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 2;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13]);
            this.addAnim('right', 0.28, [2, 8, 14]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11, 17]);
        }
    })
});
