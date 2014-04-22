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
    "use strict";

    ig.global.EntityCavalier_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/cavalier.png', 316, 156),

        attackSize:   {x: 316, y: 156},
        attackOffset: {x: -30, y: 0},
        critSize:     {x: 200, y: 175},
        critOffset:   {x: -40, y: -4},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.10, [0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.10, [4, 5, 6, 7, 8, 9, 10, 11], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.10, [0, 1, 2, 3, 3, 3, 3, 3], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.10, [4, 5, 6, 7, 8, 9, 10, 11], true);
        }
    });
});
