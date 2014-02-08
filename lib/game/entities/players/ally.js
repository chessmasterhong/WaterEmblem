/**
 *  ally.js
 *  -----
 */

ig.module(
    'game.entities.players.ally'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityAlly = ig.global.EntityBase_player.extend({
        name: 'ally',

        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [2]);
        }
    })
});
