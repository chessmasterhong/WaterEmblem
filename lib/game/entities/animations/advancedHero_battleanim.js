/**
 *  advancedHero_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.advancedHero_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityAdvancedHero_battleanim = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/hero.png', 250, 225),
        size: {x: 250, y: 225},
        flip: false,
        offset: {x: -15, y: -12},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], true);
            this.addAnim('attack1', 0.05, [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], true);
            this.addAnim('dodge', 0.07, [0, 0, 0], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    })
});
