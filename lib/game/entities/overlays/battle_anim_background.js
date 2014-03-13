/**
 *  battle_anim_background.js
 *  -----
 *  Battle animation background layer and controller.
 *
 *  Resources:
 *      http://impactjs.com/forums/help/how-to-change-a-entitys-animsheet/page/1
 */

ig.module(
    'game.entities.overlays.battle_anim_background'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBattle_anim_background = ig.Entity.extend({
        animBackgroundPlains: new ig.AnimationSheet('media/battle_backgrounds/plains.png', 640, 480),
        animBackgroundForest: new ig.AnimationSheet('media/battle_backgrounds/forest_terrain.png', 640, 480),
        animBackgroundMountains: new ig.AnimationSheet('media/battle_backgrounds/mountains.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.none = null;
            this.anims.plains = new ig.Animation(this.animBackgroundPlains, 1, [0], true);
            this.anims.forest = new ig.Animation(this.animBackgroundForest, 1, [0], true);
            this.anims.mountains = new ig.Animation(this.animBackgroundMountains, 1, [0], true);
        }
    })
});
