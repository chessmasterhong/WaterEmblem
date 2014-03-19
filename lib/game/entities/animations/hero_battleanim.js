/**
 *  hero_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.hero_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityHero_battleanim = ig.Entity.extend({
        /* TEMP */ animSheet: new ig.AnimationSheet('media/units/animations/jaffar_crit.png', 240, 240),

        //animSheetNormal: new ig.AnimationSheet('media/units/animations/jaffart.png', 200, 100),
        //animSheetCrit: new ig.AnimationSheet('media/units/animations/jaffar_crit.png', 240, 240),

        //size: {x: 200, y: 100} // Normal
        size: {x: 240, y: 240}, // Critical
        //offset: {x: -15, y: -2}, // Normal
        offset: {x: -10, y: -23}, // Critical
        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            //this.anims.idle =  new ig.Animation(animSheetNormal, 1, [0], true);
            //this.anims.dodge = new ig.Animation(_____, 0.07, [0, 0, 0], true);
            //this.anims.attack0 = new ig.Animation(animSheetNormal, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            //this.anims.attack1 = new ig.Animation(animSheetNormal, 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], true);
            //this.anims.crit0 = new ig.Animation(animSheetCrit, 0.055, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31], true);
            //this.anims.crit1 = new ig.Animation(animSheetCrit, 0.055, [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], true);

            /* TEMP */ this.addAnim('idle', 1, [0], true);
            /* TEMP */ //this.addAnim('attack0', 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            /* TEMP */ //this.addAnim('attack1', 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], true);
            /* TEMP */ this.addAnim('attack0', 0.055, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31], true);
            /* TEMP */ this.addAnim('attack1', 0.055, [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], true);
            /* TEMP */ this.addAnim('dodge', 0.07, [0, 0, 0], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    })
});
