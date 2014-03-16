/**
 *  wyvernLord_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.wyvernLord_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityWyvernLord_battleanim = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/wyvern_lord.png', 350, 300),
        size: {x: 350, y: 300},
        flip: false,
        offset: {x: -25, y: -107},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9], true);
            this.addAnim('attack1', 0.07, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 0], true);
            this.addAnim('dodge', 0.07, [0], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    })
});
