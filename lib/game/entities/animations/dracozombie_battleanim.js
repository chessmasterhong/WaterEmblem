/**
 *  dracozombie_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.dracozombie_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityDracozombie_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/dracozombie.png', 446, 226),

        attackSize:   {x: 446, y: 226},
        attackOffset: {x: 0, y: -37},
        critSize:     {x: 446, y: 226},
        critOffset:   {x: 0, y: -37},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [3], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20, 27, 26, 25, 24, 31], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.07, [3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.07, [15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20, 27, 26, 25, 24, 31], true);
        }
    });
});
