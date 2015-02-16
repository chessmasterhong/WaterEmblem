/**
 *  enemy_king.js
 *  ---------------
 */

ig.module(
    'game.entities.enemies.enemy_king'
)
.requires(
    'game.entities.abstractities.base_enemy'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_king = ig.global.EntityBase_enemy.extend({
        entityClassName: ['EntityEnemy_king'],

        name: 'Zephiel',

        animSheet: new ig.AnimationSheet('media/units/enemies/king.png', 32, 32),
        statMugshot: new ig.Image('media/statMugshots/players/zephiel.png'),
        battleAnim: 'EntityKing_battleanim',

        init: function(x, y, settings) {
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

            this.validWeapon = ['sword'];

            // Items
            this.item[0] = ig.game.itemCatalog.sword1;  this.item_uses[0] = this.item[0].uses;
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
