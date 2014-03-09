/**
 *  sword_master.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.sword_master'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntitySword_master = ig.global.EntityBase_player.extend({
        name: 'Karel',

        animSheet: new ig.AnimationSheet('media/units/players/newSwordMaster.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/karel.png'),
        modal: new ig.Image('media/modal/karel_modal.png'),

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
