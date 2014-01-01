/**
 * Player
 * -----
 * You.
 */

ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() { "use strict";
    ig.global.EntityPlayer = ig.Entity.extend({
        name: 'player',

        type: ig.Entity.TYPE.A, // Set player's collision type
        checkAgainst: ig.Entity.TYPE.B, // Set what type to collide against to run checkAgainst method
        collides: ig.Entity.COLLIDES.ACTIVE, // Set player collision handling type against another entity

        // Load animation sheet and set collision size
        animSheet: new ig.AnimationSheet("media/tilesheet.png", 32, 32),
        size: {x: 32, y: 32},

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Set animation states
            this.addAnim("idle", 1, [0]);

            // Load grid movement
            this.movement = new GridMovement(this);
            this.movement.speed = {x: this.speed, y: this.speed};
        },

        update: function() {
            this.parent();

            // Update grid movement
            this.movement.update();
            if(ig.input.state('up'))         this.movement.direction = GridMovement.moveType.UP;
            else if(ig.input.state('down'))  this.movement.direction = GridMovement.moveType.DOWN;
            else if(ig.input.state('left'))  this.movement.direction = GridMovement.moveType.LEFT;
            else if(ig.input.state('right')) this.movement.direction = GridMovement.moveType.RIGHT;
        },

        check: function(other) {
            this.parent(other);

            // Grid collision checks
            this.movement.collision();
        }
    })
});
