/***********************************************************************
  Block
  =====
  A simple static block.
***********************************************************************/

ig.module(
    'game.entities.objects.block'
)
.requires(
    'impact.entity',
    'plugins.gridmovement'
)
.defines(function() {
    EntityBlock = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 16, y: 16},
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 16, 16),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.movement = new GridMovement(this);
        },

        check: function(other) {
            this.parent(other);
            other.movement.collision();
        }
    })
});
