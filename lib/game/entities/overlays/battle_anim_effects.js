/**
 *  battle_anim_effects.js
 *  -----
 *  Battle animation effects layer and controller.
 *
 *  Resources:
 *      http://impactjs.com/forums/help/how-to-change-a-entitys-animsheet/page/1
 */

ig.module(
    'game.entities.overlays.battle_anim_effects'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBattle_anim_effects = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/battle_effects/silencer_hit_2.png', 640, 480),
        animSilencerHit: new ig.AnimationSheet('media/battle_effects/silencer_hit_2.png', 640, 480),
        animFimbulvetr: new ig.AnimationSheet('media/battle_effects/newest_fimbulvetr.png', 640, 480),
        //animForblaze: new ig.AnimationSheet('media/battle_effects/forblaze.png', 640, 400),
        animExcalibur: new ig.AnimationSheet('media/battle_effects/excalibur.png', 640, 400),

        flip: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('none', 1, [8], true);
            this.anims.silencer_hit = new ig.Animation(this.animSilencerHit, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8], true);
            this.anims.fimbulvetr = new ig.Animation(this.animFimbulvetr, 0.08, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39], true);
            //this.anims.forblaze = new ig.Animation(this.animForblaze, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 68, 70, 71, 72, 73, 74], true);
            this.anims.excalibur = new ig.Animation(this.animExcalibur, 0.10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], true);
        },

        update: function() {
            this.parent();
            this.currentAnim.flip.x = this.flip;
        }
    });
});
