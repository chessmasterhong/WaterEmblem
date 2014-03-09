/**
 *  valkyrie.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.valkyrie'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityValkyrie = ig.global.EntityBase_player.extend({
        name: 'Ursula',

        animSheet: new ig.AnimationSheet('media/units/players/newValkyrie.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/ursula.png'),
        modal: new ig.Image('media/modal/ursula_modal.png'),

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
