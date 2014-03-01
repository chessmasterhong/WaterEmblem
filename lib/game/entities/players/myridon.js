/**
 *  myridon.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.myridon'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityMyridon = ig.global.EntityBase_player.extend({
        name: 'Guy',

        animSheet: new ig.AnimationSheet('media/units/players/myridon.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('left', 0.28, [22, 23, 24]);
            this.addAnim('right', 0.28, [10, 11, 12, 20]);
            this.addAnim('down', 0.28, [5, 6, 7]);
            this.addAnim('up', 0.28, [15, 16, 17, 18]);
            this.addAnim('attack', 0.28, [20]);
        }
    })
});
