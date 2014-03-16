/**
 *  cavalier_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.cavalier_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityCavalier_battleanim = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/cavalier.png', 200, 175),
        size: {x: 200, y: 175},
        flip: false,
        offset: {x: -40, y: -4},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('attack0', 0.10, [0, 1, 2, 3, 3, 3, 3, 3], true);
            this.addAnim('attack1', 0.10, [4, 5, 6, 7, 8, 9, 10, 11], true);
            this.addAnim('dodge', 0.07, [0, 0, 0], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    })
});
