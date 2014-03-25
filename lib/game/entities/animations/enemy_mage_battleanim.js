/**
 *  enemy_mage_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_mage_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_mage_battleanim = ig.Entity.extend({

        animSheet: new ig.AnimationSheet('media/units/animations/sage.png', 185, 100 ),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/sage_critical.png', 185, 150),
        // size: {x: 185, y: 150}, // Critical Size
        size: {x: 185, y: 100}, // Normal Size
        flip: false,
        offset: {x: 90, y: 2}, // Normal Offset 
        // offset: {x: -90, y: -35}, // Critical Offset

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('dodge', 0.07, [40, 41, 0], true);
            this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], true);
            this.addAnim('attack1', 0.07, [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
                40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], true);
            this.anims.crit0 = new ig.Animation(this.animSheetCrit, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 
                29, 30, 31, 32, 33, 34, 35, 36, 37], true);
            this.anims.crit1 = new ig.Animation(this.animSheetCrit, 0.07, [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 
                61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80], true);

            // Flip all animations appropriately
            this.anims.idle.flip.x = this.flip;
            this.anims.dodge.flip.x = this.flip;
            this.anims.attack0.flip.x = this.flip;
            this.anims.attack1.flip.x = this.flip;
            this.anims.crit0.flip.x = this.flip;
            this.anims.crit1.flip.x = this.flip;
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    })
});
