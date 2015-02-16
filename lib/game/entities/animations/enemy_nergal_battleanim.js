/**
 *  enemy_nergal_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_nergal_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_nergal_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/nergal.png', 264, 240),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/nergal.png', 264, 240   ),

        attackSize:   {x: 264, y: 200},
        attackOffset: {x: 35, y: 3},
        critSize:     {x: 230.6666667, y: 115.333333},
        critOffset:   {x: -45, y: -11},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [30, 31, 32, 33, 34, 35, 130, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.10, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 0], true);
        }
    });
});
