/**
 *  battle_anim_overlay.js
 *  -----
 */

ig.module(
    'game.entities.overlays.battle_anim_gui'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBattle_anim_gui = ig.Entity.extend({
        name: 'battle_anim_gui',
        overlay: new ig.Image('media/gui/battle_screen.png'),

        draw: function() {
            // Draw image once; no this.parent()
            this.overlay.draw(0, 0);
        }
    })
});
