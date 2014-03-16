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
        animSheet: new ig.AnimationSheet('media/units/animations/wyvern_lord.png', 200, 200),
        size: {x: 200, y: 200},
        offset: {x: -45, y: 0},
        maxVel: {x: 120, y: 400},
        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            this.addAnim('attack1', 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], true);
            this.addAnim('dodge', 0.07, [0], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;

            // Animation fine-positioning
            if(this.currentAnim === this.anims.attack0 && this.currentAnim.frame === 12) { // Frame 12
                this.vel = {x: this.maxVel.x, y: -this.maxVel.y}; // Fly up
            } else if(this.currentAnim === this.anims.attack1 && this.currentAnim.frame === 4) { // Frame 18
                this.vel = {x: -this.maxVel.x, y: this.maxVel.y}; // Fly down
            } else if(this.currentAnim === this.anims.attack1 && this.currentAnim.frame === 10) { // Frame 24
                this.vel = {x: 0, y: 0}; // Stop moving
                this.pos = {x: ig.game.screen.x + ig.system.width / 2 - this.size.x / 2, y: ig.game.screen.y + 300 - this.size.y}; // Lock back to initial position
            }
        }
    })
});
