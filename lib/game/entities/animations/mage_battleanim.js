/**
 *  mage_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.mage_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityMage_battleanim = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/sage.png', 185, 100 ),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/sage_critical.png', 185, 150),

        attackSize:   {x: 185, y: 100},
        attackOffset: {x: -90, y: -2},
        critSize:     {x: 185, y: 150},
        critOffset:   {x: -90, y: -35},

        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet,      0.07, [40, 41, 0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet,      0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);
            this.anims.attack1 = new ig.Animation(this.animSheet,      0.07, [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], true);
            this.anims.crit0   = new ig.Animation(this.animSheetCrit,  0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37], true);
            this.anims.crit1   = new ig.Animation(this.animSheetCrit,  0.07, [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80], true);

            // Flip all animations appropriately
            for(var anim in this.anims)
                this.anims[anim].flip.x = this.flip;
        },

        update: function() {
            this.parent();

            // Dynamic animation sizing and offsetting
            if(this.currentAnim === this.anims.attack0 || this.currentAnim === this.anims.attack1) {
                this.size = this.attackSize;
                this.offset = this.attackOffset;
            } else if(this.currentAnim === this.anims.crit0 || this.currentAnim === this.anims.crit1) {
                this.size = this.critSize;
                this.offset = this.critOffset;
            } else {
                this.size = this.attackSize;
                this.offset = this.attackOffset;
            }
        }
    })
});
