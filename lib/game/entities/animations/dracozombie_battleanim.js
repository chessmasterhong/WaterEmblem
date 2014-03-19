/**
 *  dracozombie_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.dracozombie_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityDracozombie_battleanim = ig.Entity.extend({

        animSheet: new ig.AnimationSheet('media/units/animations/dracozombie.png', 446, 226),
        size: {x: 446, y: 226},
        flip: false,
        offset: {x: 0, y: -37},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [3], true);
            //this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], true);
            //this.addAnim('attack1', 0.07, [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], true);
            this.addAnim('attack0', 0.07, [3, 2, 1, 0, 7, 6, 5, 4, 11, 10, 9, 8], true);
            this.addAnim('attack1', 0.07, [15, 14, 13, 12, 19, 18, 17, 16, 23, 22, 21, 20, 27, 26, 25, 24, 31], true);
            this.addAnim('dodge', 0.07, [0, 0, 0], true);
        },

        update: function() {
            this.parent();
            //this.currentAnim.flip.x = this.flip;
        }
    })
});
