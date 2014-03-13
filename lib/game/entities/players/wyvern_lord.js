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
            //this.item[0] = null;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;

            this.derived_stats = ig.game.recomputeStats(this);

        }
    })
});
