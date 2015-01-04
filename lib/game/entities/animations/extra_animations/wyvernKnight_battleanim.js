/**
 *  wyvernKnight_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.wyvernKnight_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    'use strict';

    ig.global.EntityWyvernKnight_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/wyvern_knight.png', 250, 200),

        attackSize:   {x: 250, y: 200},
        attackOffset: {x: -15, y: -4},
        critSize:     {x: 250, y: 200},
        critOffset:   {x: -15, y: -4},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.09, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 0], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 6, 6, 6, 6, 6, 6, 6], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.09, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 0], true);
        }
    });
});
