/**
 * Player
 * -----
 * You.
 */

ig.module(
    'game.entities.players.hero'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityHero = ig.global.EntityBase_player.extend({
        name: 'player',

        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
        }
    })
});
