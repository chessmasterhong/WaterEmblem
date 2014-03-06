/**
 *  battle_anim_overlay.js
 *  -----
 */

ig.module(
    'game.entities.misc.battle_anim_overlay'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBattle_anim_overlay = ig.Entity.extend({
        name: 'battle_anim_overlay',
        overlay: new ig.Image('media/gui/battle_screen.png'),

        draw: function() {
            // Draw image once; no this.parent()
            this.overlay.draw(0, 0);
        }
    })
});
