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
    'use strict';

    ig.global.EntityWyvern_lord = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityWyvern_lord'],

        name: 'Heath',

        animSheet: new ig.AnimationSheet('media/units/players/newWyvernLord.png', 32, 32),
        statMugshot: new ig.Image('media/statMugshots/players/heath.png'),
        mugshot: new ig.Image('media/mugshots/players/heath.png'),
        modal: new ig.Image('media/modal/heath_modal.png'),
        battleAnim: 'EntityWyvernLord_battleanim',

        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health_max = 10;
            this.stat.str = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 12;

            this.validWeapon = ['lance'];

            // Items
            this.item[0] = ig.game.itemCatalog.lance1;  this.item_uses[0] = this.item[0].uses;
            //this.item[0] = null;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;
            this.stat.mov = 15;

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    });
});
