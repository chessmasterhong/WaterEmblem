/**
 *  wyvern_knight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.wyvern_knight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    'use strict';

    ig.global.EntityWyvern_knight = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityWyvern_knight'],

        name: 'Heath',

        animSheet: new ig.AnimationSheet('media/units/players/newWyvernKnight.png', 32, 32),
        statMugshot: new ig.Image('media/statMugshots/players/heath.png'),
        mugshot: new ig.Image('media/mugshots/players/heath.png'),
        modal: new ig.Image('media/modal/heath_modal.png'),
        battleAnim: 'EntityWyvernKnight_battleanim',

        levelUpStatPercentage: {
            atk: 0.8,
            mag: 0.0,
            skl: 0.7,
            def: 0.55,
            res: 0.15,
            spd: 0.4,
            luk: 0.4
        },

        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health_max = 21;
            this.health = 21;
            this.stat.atk = 10;
            this.stat.mag = 0;
            this.stat.skl = 7;
            this.stat.def = 6;
            this.stat.res = 0;
            this.stat.spd = 6;
            this.stat.luk = 4;
            this.stat.mov = 15;

            // Items
            this.item[0] = ig.game.itemCatalog.sword1;  this.item_uses[0] = this.item[0].uses;
            //this.item[0] = null;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    });
});
