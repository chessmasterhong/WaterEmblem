/**
 *  cavalier_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.cavalier_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityCavalier_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/cavalier.png', 395, 195),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/cavalier_crit.png', 385, 222.6666667),

        attackSize:   {x: 395, y: 195},
        attackOffset: {x: -30, y: 0},
        critSize:     {x: 385, y: 222.6666667},
        critOffset:   {x: -40, y: -4},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.10, [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.10, [4, 5, 6, 7, 8, 9, 10, 11], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 18, 18, 18, 18, 18], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.07, [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32], true);
        }
    });
});
