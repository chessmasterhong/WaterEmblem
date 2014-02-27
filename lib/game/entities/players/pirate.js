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

        animSheet: new ig.AnimationSheet('media/tilesets/players/pirate.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.level = 1;
            this.health_max = 10;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 4;

            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('left', 0.28, [15, 16, 17]);
            this.addAnim('right', 0.28, [22, 23, 24]);
            this.addAnim('down', 0.28, [5, 6, 7, 8]);
            this.addAnim('up', 0.28, [10, 11, 12, 13]);
            this.addAnim('attack', 0.28, [20]);
        }
    })
});
