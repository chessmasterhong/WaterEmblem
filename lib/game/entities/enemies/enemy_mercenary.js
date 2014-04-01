/**
 *  enemy_mercenary.js
 *  --------------- 
 */

ig.module(
    'game.entities.enemies.enemy_mercenary'
)
.requires(
    'game.entities.abstractities.base_enemy'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_mercenary = ig.global.EntityBase_enemy.extend({
        entityClassName: ['EntityEnemy_mercenary'],

        name: 'Practice Dummy',

        animSheet: new ig.AnimationSheet('media/units/enemies/enemies_mercenary.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/enemies/enemy_mercenary.png'),
        battleAnim: 'EntityEnemy_assassin_battleanim',

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

            // Items
            this.item[0] = ig.game.itemCatalog.axe1;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [5, 6, 7, 8]);
            this.addAnim('down', 0.28, [10, 11, 12, 13]);
            this.addAnim('left', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('right', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('attack', 0.28, [15, 16]);

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    });
});
