/**
 *  fighter.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.fighter'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    'use strict';

    ig.global.EntityFighter = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityFighter'],

        name: 'Bartre',

        animSheet: new ig.AnimationSheet('media/units/players/fighter.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/bartre.png'),
        modal: new ig.Image('media/modal/bartre_modal.png'),
        battleAnim: 'EntityFighter_battleanim',

        levelUpStatPercentage: {
            atk: 0.6,
            mag: 0.0,
            skl: 0.5,
            def: 0.15,
            res: 0.3,
            spd: 0.3,
            luk: 0.4
        },

        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health_max = 22;
            this.health = 22;
            this.stat.atk = 9;
            this.stat.mag = 0;
            this.stat.skl = 5;
            this.stat.def = 4;
            this.stat.res = 0;
            this.stat.spd = 3;
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
