/**
 * block.js
 * -----
 * A simple static block.
 */

ig.module(
    'game.entities.objects.block'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() { "use strict";
    ig.global.EntityBlock = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [3]);
            this.movement = new GridMovement(this);
        },

        check: function(other) {
            this.parent(other);
            other.movement.collision();
        }
    })
});
