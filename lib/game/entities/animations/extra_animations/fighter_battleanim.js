/**
 *  fighter_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.fighter_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityFighter_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/fighter.png', 250, 212.5),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/fighter_crit.png', 267.5263158, 212.5),

        attackSize:   {x: 250, y: 212.5},
        attackOffset: {x: -35, y: -4},
        critSize:     {x: 267.5263158, y: 212.5},
        critOffset:   {x: -40, y: -4},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 13, 13, 13], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.07, [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], true);
        }
    });
});
