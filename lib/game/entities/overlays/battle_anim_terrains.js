/**
 *  battle_anim_terrains.js
 *  -----
 *  Battle animation terrain layer and controller.
 *
 *  Resources:
 *      http://impactjs.com/forums/help/how-to-change-a-entitys-animsheet/page/1
 */

ig.module(
    'game.entities.overlays.battle_anim_terrains'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBattle_anim_terrains = ig.Entity.extend({
        animTerrainsBlank: new ig.AnimationSheet('media/gui/battleTerrain.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.none = null;
            this.anims.blank = new ig.Animation(this.animTerrainsBlank, 1, [0], true);
        }
    });
});
