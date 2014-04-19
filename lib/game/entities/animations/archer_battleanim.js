/**
 *  archer_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.archer_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityArcher_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/archer.png', 112.5, 100),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/archer_crit.png', 340, 100),


        attackSize:   {x: 112.5, y: 100},
        attackOffset: {x: -80, y: 0},
        critSize:     {x: 340, y: 100},
        critOffset:   {x: -160, y: 0},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [11, 12, 13, 14, 15, 16, 17], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.07, [20, 21, 22, 23, 24, 25], true);
        }
    });
});
