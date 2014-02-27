/**
 *  troubadour.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.troubadour'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityTroubadour = ig.global.EntityBase_player.extend({
        name: 'Prscilla',

        animSheet: new ig.AnimationSheet('media/tilesets/players/troubadour.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('left', 0.28, [20, 21, 22, 23]);
            this.addAnim('right', 0.28, [5, 6, 7, 8]);
            this.addAnim('down', 0.28, [15, 16, 17, 18]);
            this.addAnim('up', 0.28, [10, 11, 12, 13]);
            this.addAnim('attack', 0.28, [4, 9, 14]);
        }
    })
});
