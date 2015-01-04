/**
 *  enemy_pegasus_knight_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_pegasus_knight_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_pegasus_knight_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/pegasus_knight.png', 370, 265),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/pegasus_knight_crit.png', 370, 272.5),

        attackSize:   {x: 370, y: 265},
        attackOffset: {x: 45, y: -5},
        critSize:     {x: 370, y: 272.5},
        critOffset:   {x: -45, y: -11},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 0], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.10, [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], true);
        }
    });
});
