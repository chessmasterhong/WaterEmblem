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
.defines(function() {
    "use strict";

    ig.global.EntityPlayer = ig.Entity.extend({
        name: 'player',
        unitType: 'friend',

        type: ig.Entity.TYPE.A, // Set player's collision type
        checkAgainst: ig.Entity.TYPE.B, // Set what type to collide against to run checkAgainst method
        collides: ig.Entity.COLLIDES.PASSIVE, // Set player collision handling type against another entity

        // Load animation sheet and set collision size
        animSheet: new ig.AnimationSheet("media/tilesheet.png", 32, 32),
        size: {x: 32, y: 32},

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128,

        dir: 'idle',
        destination: null,

        stat_speed: 5,

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

            // Not in combat mode (ig.game.activeUnit = undefined)
            if(typeof ig.game.activeUnit === 'undefined') {
                // Enable running
                if(ig.input.state('SHIFT'))
                    this.movement.speed = this.maxVel;
                else
                    this.movement.speed = {x: this.speed, y: this.speed};

                // Update grid movement
                this.movement.update();
                if(ig.input.state('up'))         this.movement.direction = GridMovement.moveType.UP;
                else if(ig.input.state('down'))  this.movement.direction = GridMovement.moveType.DOWN;
                else if(ig.input.state('left'))  this.movement.direction = GridMovement.moveType.LEFT;
                else if(ig.input.state('right')) this.movement.direction = GridMovement.moveType.RIGHT;
            // In combat mode and is current active unit
            } else if(ig.game.units[ig.game.activeUnit] === this) {
                // Update grid movement
                this.movement.update();
                //console.log('active unit: ' + ig.game.activeUnit);
                // Destination not set yet
                if(this.destination === null) {
                    // Wait for user's input
                    if(ig.input.state('up')) {
                        this.movement.direction = GridMovement.moveType.UP;
                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y - ig.global.tilesize, ig.global.tilesize);
                    } else if(ig.input.state('down')) {
                        this.movement.direction = GridMovement.moveType.DOWN;
                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y + ig.global.tilesize, ig.global.tilesize);
                    } else if(ig.input.state('left')) {
                        this.movement.direction = GridMovement.moveType.LEFT;
                        this.destination = ig.global.alignToGrid(this.pos.x - ig.global.tilesize, this.pos.y, ig.global.tilesize);
                    } else if(ig.input.state('right')) {
                        this.movement.direction = GridMovement.moveType.RIGHT;
                        this.destination = ig.global.alignToGrid(this.pos.x + ig.global.tilesize, this.pos.y, ig.global.tilesize);
                    }
                // Destination has been set
                } else {
                    // Destination has been reached
                    if((this.pos.x <= this.destination.x && this.last.x > this.destination.x) ||
                       (this.pos.x >= this.destination.x && this.last.x < this.destination.x) ||
                       (this.pos.y <= this.destination.y && this.last.y > this.destination.y) ||
                       (this.pos.y >= this.destination.y && this.last.y < this.destination.y)) {
                        // Reset destination and advance activeUnit to next unit
                        this.destination = null;
                        ig.game.activeUnit = (ig.game.activeUnit + 1) % ig.game.units.length;
                    // Destination not reached yet
                    } else {
                        // Move the player based on input
                        if(this.dir === 'UP')         this.movement.direction = GridMovement.moveType.UP;
                        else if(this.dir === 'DOWN')  this.movement.direction = GridMovement.moveType.DOWN;
                        else if(this.dir === 'LEFT')  this.movement.direction = GridMovement.moveType.LEFT;
                        else if(this.dir === 'RIGHT') this.movement.direction = GridMovement.moveType.RIGHT;
                    }
                }
            }
        },

        check: function(other) {
            this.parent(other);

            // Grid collision checks
            this.movement.collision();
        }
    })
});
