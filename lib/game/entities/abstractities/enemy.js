/**
 * enemy.js
 * -----
 * Base enemy entity. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.enemy'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_enemy = ig.Entity.extend({
        unitType: 'enemy',
        turnUsed: false,

        // Collision types
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Collision box size
        size: {x: 32, y: 32},

        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,

        // Avoid these entities when pathfinding
        entitiesAvoid: ['EntityBase_enemy'],

        // Target these entities when pathfinding
        entitiesTarget: ['EntityPlayer'],

        // Current and maximum movement speed
        maxVel: {x: 256, y: 256},
        speed: 128,

        destination: null,

        stat_speed: 1,
        stat_move_max: 3,
        //stat_move_curr: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.pathTimer = new ig.Timer();
            this.maxMovement = this.stat_move_max * 32 - 0.0001; // If set to multiple of tile size, wierd stuff happens when pathfinding enemy aligns to target, so we set it very close to tile size.
        },

        update: function() {
            this.parent();

            // Only compute path if this unit is the active unit
            if(ig.game.units[ig.game.activeUnit].name === this.name) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Create and display path
                    if(this.destination === null) {
                        var player = ig.game.getEntityByName('player');
                        this.getPath(player.pos.x, player.pos.y, false, this.entitiesAvoid, this.entitiesTarget);
                        this.realignToGrid();
                        this.pathTimer.reset();
                        this.destination = ig.global.alignToGrid(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
                    }

                    // Visual delay between generating path and moving unit along path
                    if(this.pathTimer.delta() > 0.5) {
                        if(this.destination === null ||
                           this.pos.x !== this.destination.x ||
                           this.pos.y !== this.destination.y) {
                            // Move along determined path
                            this.followPath(this.speed, true);

                            // Quickfix for improper grid alignment when pathfinding; let unit know pathfinding destination has been reached
                            if(this.vel.x === 0 && this.vel.y === 0)
                                this.pos = this.destination;
                        } else {
                            // Destination reached, reset destination and advance activeUnit to next unit
                            this.vel = {x: 0, y: 0};
                            this.realignToGrid();
                            this.destination = null;
                            this.turnUsed = true;
                        }
                    }
                }
            }
        },

        // Realigns an entity back to the grid (entity's position rounded to
        // nearest multiple of tile size). This is necessary since this entity
        // is not using the grid-based movement by default, so we create a
        // psuedo-grid-based movement by realigning the entity back to the grid
        // and only allow horizontal/vertical movements.
        realignToGrid: function() {
            this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y);
            this.pos.x += ig.global.sgn(this.vel.x) * ig.global.tilesize;
            this.pos.y += ig.global.sgn(this.vel.y) * ig.global.tilesize;
            this.vel = {x: 0, y: 0};
        },

        check: function(other) {
            this.parent(other);

            // Realign back to grid on collision in case entity gets knocked off of grid
            this.realignToGrid();

            if(other instanceof EntityPlayer) {
                this.receiveDamage(1);
                //console.log(this.name + ': health = ' + this.health);
            }
        },

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        }
    })
});
