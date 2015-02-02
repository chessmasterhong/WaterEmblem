/**
 *  enemy_warrior_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_warrior_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_Warrior_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/warrior.png', 282.5, 217.5),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/warrior_crit.png', 292.5294118, 222.6),

        attackSize:   {x: 282.5, y: 217.5},
        attackOffset: {x: 60, y: -25},
        critSize:     {x: 292.5294118, y: 222.6},
        critOffset:   {x: -25, y: -22},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.08, [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.08, [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 36, 36, 36, 36, 36, 36], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.05, [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71], true);
        }
    });
});
