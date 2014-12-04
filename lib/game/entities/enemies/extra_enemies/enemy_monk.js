/**
 *  enemy_monk.js
 *  -----
 *
 */

ig.module(
    'game.entities.enemies.enemy_monk'
)
.requires(
    'game.entities.abstractities.base_enemy'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_monk = ig.global.EntityBase_enemy.extend({
        entityClassName: ['EntityMonk'],

        name: 'Practice Dummy',

        animSheet: new ig.AnimationSheet('media/units/players/newMonk.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/enemies/enemy_cleric.png'),
        modal: new ig.Image('media/modal/lucius_modal.png'),
        battleAnim: 'EntityEnemy_monk_battleanim',


        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health_max = 12;
            this.health = 12;
            this.stat.atk = 5;
            this.stat.mag = 5;
            this.stat.skl = 5;
            this.stat.def = 0;
            this.stat.res = 5;
            this.stat.spd = 6;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Items
            this.item[0] = ig.game.itemCatalog.tome3;  this.item_uses[0] = this.item[0].uses;
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
