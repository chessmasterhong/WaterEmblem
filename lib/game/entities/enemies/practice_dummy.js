/*******************************************************************************
  dummy_target.js
  -----
  A simple "punching bag enemy".
*******************************************************************************/

ig.module(
    'game.entities.enemies.practice_dummy'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    EntityPractice_dummy = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [2]);
            this.movement = new GridMovement(this);
        },

        check: function(other) {
            this.parent(other);
            other.movement.collision();
        }
    })
});
