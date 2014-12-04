/**
 *  battle_anim_gui.js
 *  -----
 *  Battle animation data display layer.
 */

ig.module(
    'game.entities.overlays.battle_anim_gui'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityBattle_anim_gui = ig.Entity.extend({
        animSheet: new ig.AnimationSheet('media/gui/newBattleScreen.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.none = null;
            this.addAnim('showGUI', 1, [0], true);
        }
    });
});
