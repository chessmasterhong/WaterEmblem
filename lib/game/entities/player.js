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
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    EntityPlayer = ig.Entity.extend({
        type: ig.Entity.TYPE.A, // Set player's collision type
        checkAgainst: ig.Entity.TYPE.B, // Set what type to collide against to run checkAgainst method
        collides: ig.Entity.COLLIDES.ACTIVE, // Set player collision handling type against another entity

        // Add animation and set collision
        animSheet: new ig.AnimationSheet("media/tilesheet.png", 32, 32),
        size: {x: 32, y: 32},

        // Override ImpactJS default properties
        maxVel: {x: 256, y: 256},

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            
            // Set animation states
            this.addAnim("idle", 1, [0]);

            // Load grid movement plugin
            this.movement = new GridMovement(this);
        },

        update: function() {
            this.parent();
            
            // Update grid movement
            this.movement.update();
            ig.input.state('left')  ?   this.movement.direction = GridMovement.moveType.LEFT :
            ig.input.state('right') ?   this.movement.direction = GridMovement.moveType.RIGHT :
            ig.input.state('up')    ?   this.movement.direction = GridMovement.moveType.UP :
            ig.input.state('down')  && (this.movement.direction = GridMovement.moveType.DOWN);
        },

        check: function(other) {
            this.parent(other);
            
            // Do grid-based collision checks
            this.movement.collision();
        }
    })
});
