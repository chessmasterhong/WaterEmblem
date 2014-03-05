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
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,

        size: {x: 640, y: 480},

        animSheet: new ig.AnimationSheet('media/gui/battle_screen.png', 640, 480),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Animation states
            this.addAnim('default', 1, [0], true);
        },
    })
});
