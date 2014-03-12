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
        name: 'battle_anim_effects',

        animSilencerHit: new ig.AnimationSheet('media/battle_effects/silencer_hit_2.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.idle = null;
            this.anims.silencer_hit = new ig.Animation(this.animSilencerHit, 0.05, [0, 1, 2, 3, 4, 5, 6, 7, 8], true);
        }
    })
});
