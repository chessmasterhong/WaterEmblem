/**
 * base_player.js
 * -----
 * Base player/playable unit. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.base_player'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_player = ig.Entity.extend({
        unitType: 'party',
        turnUsed: false,

        // Collision types
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.ACTIVE,

        // Set collision size
        size: {x: 32, y: 32},

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128,

        dir: 'idle',
        destination: null,

        stat_speed: 5,
        stat_move_max: 4,
        stat_move_curr: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

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
            } else if(ig.game.units[ig.game.activeUnit].name === this.name) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Update grid movement
                    this.movement.update();

                    // Destination not set yet
                    if(this.destination === null) {
                        // Wait for user's input
                        if(ig.input.state('up')) {
                            this.movement.direction = GridMovement.moveType.UP;
                            this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y - ig.global.tilesize);
                        } else if(ig.input.state('down')) {
                            this.movement.direction = GridMovement.moveType.DOWN;
                            this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y + ig.global.tilesize);
                        } else if(ig.input.state('left')) {
                            this.movement.direction = GridMovement.moveType.LEFT;
                            this.destination = ig.global.alignToGrid(this.pos.x - ig.global.tilesize, this.pos.y);
                        } else if(ig.input.state('right')) {
                            this.movement.direction = GridMovement.moveType.RIGHT;
                            this.destination = ig.global.alignToGrid(this.pos.x + ig.global.tilesize, this.pos.y);
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
                            this.stat_move_curr++;
                        }
                    }

                    // If unit used up all their movement points, end their turn
                    if(this.stat_move_curr >= this.stat_move_max)
                        this.turnUsed = true;
                }
            }
        },

        check: function(other) {
            this.parent(other);

            // Grid collision checks
            //this.movement.collision();

            // Lock the unit in place and prevent unit from sliding due to collision
            this.pos = ig.global.alignToGrid(this.last.x, this.last.y);
            this.vel = {x: 0, y: 0};
            
            if(other instanceof EntityBase_enemy) {
                if(ig.game.units[ig.game.activeUnit].name === this.name) {
                    other.receiveDamage(5);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                    this.destination = null;
                    this.dir = 'idle';
                    this.movement.destination = null;
                    this.movement.direction = null;
                    this.turnUsed = true;
                }
            }
        },
        
        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        }
    })
});
