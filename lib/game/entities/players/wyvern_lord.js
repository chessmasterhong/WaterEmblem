/**
 *  wyvern_lord.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.wyvern_lord'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityWyvern_lord = ig.global.EntityBase_player.extend({
        //name: 'Nergal',

        animSheet: new ig.AnimationSheet('media/units/players/newWyvernLord.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/heath.png'),
        modal: new ig.Image('media/modal/heath_modal.png'),

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
