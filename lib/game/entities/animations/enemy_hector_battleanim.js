/**
 *  enemy_hector_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_hector_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityEnemy_hector_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/hector.png', 245, 200),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/hector.png', 246, 123),

        attackSize:   {x: 245, y: 200},
        attackOffset: {x: 35, y: -18},
        critSize:     {x: 230.6666667, y: 115.333333},
        critOffset:   {x: -45, y: -11},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22, 22], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [23, 24, 25, 26, 27, 28, 29, 30, 31, 0], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.10, [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 0], true);
        }
    });
});
