/**
 *  enemy_assassin_battle.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_assassin_battle'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_assassin_battle = ig.Entity.extend({
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,

        size: {x: 200, y: 100},

        animSheet: new ig.AnimationSheet('media/units/animations/new_jaffar.png', 200, 100),
        
        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Animation states
            //this.addAnim('attack', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
            this.addAnim('attack', 0.07, [0]);
            this.currentAnim.flip.x = this.flip;
        },
    })
});
