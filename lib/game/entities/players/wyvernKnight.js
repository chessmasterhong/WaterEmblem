/**
 *  wyvernKnight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.wyvernKnight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityWyvernKnight = ig.global.EntityBase_player.extend({
        name: 'Vaida',

        animSheet: new ig.AnimationSheet('media/tilesets/players/wyvernKnight.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

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
