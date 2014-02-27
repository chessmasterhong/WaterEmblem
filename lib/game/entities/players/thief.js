/**
 *  thief.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.thief'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityThief = ig.global.EntityBase_player.extend({
        name: 'Matthew',

        animSheet: new ig.AnimationSheet('media/tilesets/players/thief.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

            // Animation states
            this.addAnim('idle', 0.28, [15, 16, 17]);
            this.addAnim('left', 0.28, [0, 1, 2]);
            this.addAnim('right', 0.28, [22, 23, 24]);
            this.addAnim('down', 0.28, [10, 11, 12]);
            this.addAnim('up', 0.28, [5, 6, 7]);
            this.addAnim('attack', 0.28, [20, 21]);
        }
    })
});
