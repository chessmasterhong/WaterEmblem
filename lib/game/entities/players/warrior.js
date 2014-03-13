/**
 *  warrior.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.warrior'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityWarrior = ig.global.EntityBase_player.extend({
        //name: 'Rebecca',

        animSheet: new ig.AnimationSheet('media/units/players/warrior.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/georg.png'),
        modal: new ig.Image('media/modal/georg_modal.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 10;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 4;

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
