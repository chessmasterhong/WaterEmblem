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
    'use strict';

    ig.global.EntityBattle_anim_background = ig.Entity.extend({
        animBackgroundPlains: new ig.AnimationSheet('media/backgrounds/plains.png', 640, 480),
        animBackgroundFortress: new ig.AnimationSheet('media/backgrounds/castle.png', 640, 480),
        animBackgroundForest: new ig.AnimationSheet('media/backgrounds/forest.png', 640, 480),
        animBackgroundMountains: new ig.AnimationSheet('media/backgrounds/mountain.png', 640, 480),
        animBackgroundSand: new ig.AnimationSheet('media/backgrounds/desert.png', 640, 480),
        animBackgroundCastle: new ig.AnimationSheet('media/backgrounds/castle.png', 640, 480),
        animBackgroundSnow: new ig.AnimationSheet('media/backgrounds/snowfield.png', 640, 480),
        animBackgroundThrone: new ig.AnimationSheet('media/backgrounds/throne.png', 640, 480),
        animBackgroundSnowForest: new ig.AnimationSheet('media/backgrounds/snow_forest.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.none = null;
            this.anims.plains = new ig.Animation(this.animBackgroundPlains, 1, [0], true);
            this.anims.fortress = new ig.Animation(this.animBackgroundFortress, 1, [0], true);
            this.anims.forest = new ig.Animation(this.animBackgroundForest, 1, [0], true);
            this.anims.mountains = new ig.Animation(this.animBackgroundMountains, 1, [0], true);
            this.anims.sand = new ig.Animation(this.animBackgroundSand, 1, [0], true);
            this.anims.castle = new ig.Animation(this.animBackgroundCastle, 1, [0], true);
            this.anims.snow = new ig.Animation(this.animBackgroundSnow, 1, [0], true);
            this.anims.throne = new ig.Animation(this.animBackgroundThrone, 1, [0], true);
            this.anims.snowforest = new ig.Animation(this.animBackgroundSnowForest, 1, [0], true);
        }
    });
});
