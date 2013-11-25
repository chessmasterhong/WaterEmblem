/***********************************************************************
  Player
  ======
  You.
***********************************************************************/

ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'plugins.gridmovement'
)
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,

        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet("media/tilesheet.png", 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim("idle", 1, [0]);
            this.movement = new GridMovement(this);
        },

        update: function() {
            this.parent();
            this.movement.update();
            ig.input.state("left")  ?   this.movement.direction = GridMovement.moveType.LEFT :
            ig.input.state("right") ?   this.movement.direction = GridMovement.moveType.RIGHT :
            ig.input.state("up")    ?   this.movement.direction = GridMovement.moveType.UP :
            ig.input.state("down")  && (this.movement.direction = GridMovement.moveType.DOWN);
        },

        check: function(other) {
            this.parent(other);
            this.movement.collision();
        }
    })
});
