/**
 *  enemy_wyvernLord_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_wyvernLord_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_WyvernLord_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/wyvern_lord.png', 410, 320),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/wyvern_lord_critical.png', 410, 320),

        attackSize:   {x: 410, y: 320},
        attackOffset: {x: -25, y: -112},
        critSize:     {x: 410, y: 320},
        critOffset:   {x: 25, y: -112},

        //maxVel: {x: 120, y: 400},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.07, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 0], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,24, 25, 26, 27, 27, 27, 27, 27], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit, 0.07, [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54], true);
        },

        update: function() {
            this.parent();

            // Animation fine-positioning
            //if(this.currentAnim === this.anims.attack0 && this.currentAnim.frame === 9) { // Frame 12
            //    this.vel = {x: this.maxVel.x, y: -this.maxVel.y}; // Fly up
            //} else if(this.currentAnim === this.anims.attack1 && this.currentAnim.frame === ) { // Frame 18
            //    this.vel = {x: -this.maxVel.x, y: this.maxVel.y}; // Fly down
            //} else if(this.currentAnim === this.anims.attack1 && this.currentAnim.frame === 10) { // Frame 24
            //    this.vel = {x: 0, y: 0}; // Stop moving
            //    this.pos = {x: ig.game.screen.x + ig.system.width / 2 - this.size.x / 2, y: ig.game.screen.y + 300 - this.size.y}; // Lock back to initial position
            //}
        }
    });
});
