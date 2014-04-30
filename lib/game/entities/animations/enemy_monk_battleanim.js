/**
 *  enemy_monk_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_monk_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_monk_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/monk.png', 135, 93),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/monk_crit.png', 142.5142857, 115),

        attackSize:   {x: 135, y: 93},
        attackOffset: {x: 70, y: 0},
        critSize:     {x: 142.5142857, y: 115},
        critOffset:   {x: -25, y: -22},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.08, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.08, [17, 18, 19, 20, 21], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.05, [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 51, 52], true);
        }
    });
});
