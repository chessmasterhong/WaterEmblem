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
        animSheet: new ig.AnimationSheet('media/units/animations/jaffar_attack.png', 225, 108),
        //animSheetNormal: new ig.AnimationSheet('media/units/animations/jaffar_attack.png', 255, 108),
        animSheetCrit: new ig.AnimationSheet('media/units/animations/jaffar_crit.png', 308, 270),

        //size: {x: 200, y: 100} // Normal
        size: {x: 225, y: 108}, // Critical
        //offset: {x: -15, y: -2}, // Normal
        offset: {x: -20, y: -5}, // Critical
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);

            //this.anims.idle =  new ig.Animation(animSheetNormal, 1, [0], true);
            //this.anims.dodge = new ig.Animation(_____, 0.07, [0, 0, 0], true);
            //this.anims.attack0 = new ig.Animation(animSheetNormal, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            //this.anims.attack1 = new ig.Animation(animSheetNormal, 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], true);
            //this.anims.crit0 = new ig.Animation(animSheetCrit, 0.055, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31], true);
            //this.anims.crit1 = new ig.Animation(animSheetCrit, 0.055, [32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], true);

            //this.anims.idle = new ig.Animation(this.animSheetNormal, 1, [0], true);
            this.addAnim('idle', 1, [0], true);
            this.addAnim('dodge', 0.07, [0, 0, 0], true);
            this.addAnim('attack0', 0.055, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            this.addAnim('attack1', 0.055, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46], true);
            this.anims.crit0 = new ig.Animation(this.animSheetCrit, 0.06, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], true);
            this.anims.crit1 = new ig.Animation(this.animSheetCrit, 0.06, [40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], true);

            //this.addAnim('idle', 1, [0], true);
            //this.addAnim('dodge', 0.07, [0, 0, 0], true);
            //this.addAnim('attack0', 0.055, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], true);
            //this.addAnim('attack1', 0.055, [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], true);

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

            // Animation-based sizing and offsetting
            /*if(this.currentAnim === this.anims.attack0 || this.currentAnim === this.anims.attack1) {
                this.size = {x: 225, y: 108};
                this.offset = {x: -20, y: -5};
            } else if(this.currentAnim === this.anims.crit0 || this.currentAnim === this.anims.crit1) {
                this.size = {x: 308, y: 270};
                this.offset = {x: -40, y: -25};
            } else {
                this.size = {x: 225, y: 108};
                this.offset = {x: -20, y: -5};
            }*/

            // Trigger battle animation effect layer
            if(this.currentAnim === this.anims.crit0 && this.currentAnim.frame === 39) {
                ig.game.battleAnimControllers.effects.currentAnim = ig.game.battleAnimControllers.effects.anims.silencer_hit;
                ig.game.battleAnimControllers.effects.currentAnim.rewind();
            }
        }
    })
});
