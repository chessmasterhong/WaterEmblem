/**
 *  enemy_knight_lord_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_knight_lord_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_knight_lord_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/knight_lord.png', 360, 265),
        //animSheetCrit: new ig.AnimationSheet('media/units/animations/archer_crit.png', 340, 100),


        attackSize:   {x: 360, y: 265},
        attackOffset: {x: 35, y: 0},
        critSize:     {x: 340, y: 100},
        critOffset:   {x: -160, y: 0},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.08, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.06, [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.07, [20, 21, 22, 23, 24, 25], true);
        }
    });
});
