/**
 *  knight_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.knight_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityKnight_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/knight.png', 307.5, 102.5),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/knight_crit.png', 312.5, 195),

        attackSize:   {x: 307.5, y: 102.5},
        attackOffset: {x: -35, y: 0},
        critSize:     {x: 312.5, y: 195},
        critOffset:   {x: -160, y: 0},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.12, [9, 10, 11, 12, 13, 14, 15, 16], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.09, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 25, 25], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.09, [26, 27, 28, 29, 30, 31, 32, 33], true);
        }
    });
});
