/**
 *  ally.js
 *  -----
 *  Friendly assisting units.
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
        //name: 'Nino',

        animSheet: new ig.AnimationSheet('media/units/players/monk.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

            // Items
            //this.item[0] = null;
            //this.item[1] = null;
            //this.item[2] = null;
            //this.item[3] = null;
            //this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

        }
    })
});
