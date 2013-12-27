/*******************************************************************************
  Push Block
  ==========
  A simple push block that moves in the direction pushed.
*******************************************************************************/

ig.module(
    'game.entities.objects.push'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    EntityPush = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 32, y: 32},
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0]);
            this.movement = new GridMovement(this);
        },
        
        update: function() {
            this.parent();
            this.movement.update();
        },
        
        check: function(other) {
            this.parent(other);
            this.movement.collision();
            this.move(this.getRelativePos(other));
        },
        
        move: function(dir) {
            this.movement.direction = dir;
        },

        getRelativePos: function(other) {
            if(other.last.x > this.pos.x) return GridMovement.moveType.LEFT;
            if(other.last.x < this.pos.x) return GridMovement.moveType.RIGHT;
            if(other.last.y > this.pos.y) return GridMovement.moveType.UP;
            if(other.last.y < this.pos.y) return GridMovement.moveType.DOWN;
        }
    })
});
