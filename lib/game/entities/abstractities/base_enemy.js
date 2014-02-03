/**
 * base_enemy.js
 * -----
 * Base enemy unit. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.base_enemy'
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
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        // Collision box size
        size: {x: 32, y: 32},

        // Begin pathfinding and movement properties ---------------------------
        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        destination: null,

        // Avoid these entities when pathfinding (must be an array of strings)
        entitiesAvoid: ['EntityBase_enemy'],

        // Ignore these entities when pathfinding (must be an array of variables)
        entitiesIgnore: [],

        // Current and maximum movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with stat.speed
        // End pathfinding and movement properties -----------------------------

        stat_maxHealth: 0,
        stat_speed: 1,
        stat_move_max: 3,
        //stat_move_curr: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pathTimer = new ig.Timer();
            this.hpBarTimer = new ig.Timer();

            this.stat_maxHealth = this.health;

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat_move_max * ig.global.tilesize - 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.
        },

        update: function() {
            this.parent();

            // Only compute path if this unit is the active unit
            if(ig.game.units[ig.game.activeUnit].name === this.name) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    if(this.pathTimer.delta() > 0.2) {
                        // Create and display path
                        if(this.destination === null) {
                            // Find closest target unit to pathfind towards
                            var player = ig.game.getEntitiesByType('EntityBase_player');
                            if(player !== null) {
                                var closest = {index: null, dist: 0};
                                for(var p = 0; p < player.length; p++) {
                                    var d = this.distanceTo(player[p]);
                                    if(closest.index === null || d < closest.dist)
                                        closest = {index: p, dist: d};
                                }
                                player = player[closest.index];

                                this.getPath(player.pos.x, player.pos.y, false, this.entitiesAvoid, this.entitiesIgnore);
                                this.realignToGrid();
                                this.pathTimer.reset();

                                if(this.path !== null)
                                    this.destination = ig.global.alignToGrid(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
                            } else {
                                this.turnUsed = true;
                            }
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
            } else {
                this.pathTimer.reset();
            }
        },

        // Realigns an unit back to the grid (unit's position rounded to nearest
        // multiple of tile size). This is necessary since this unit is not
        // using the grid-based movement by default, so we create a
        // psuedo-grid-based movement by realigning the unit back to the grid
        // and only allow horizontal/vertical movements.
        realignToGrid: function() {
            this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y);
            this.pos.x += ig.global.sgn(this.vel.x) * ig.global.tilesize;
            this.pos.y += ig.global.sgn(this.vel.y) * ig.global.tilesize;
            this.vel = {x: 0, y: 0};
        },

        check: function(other) {
            this.parent(other);

            // Realign back to grid on collision in case unit gets knocked off of grid
            this.realignToGrid();

            // Lock the unit in place and prevent unit from sliding due to collision
            this.pos = ig.global.alignToGrid(this.last.x, this.last.y);
            this.vel = {x: 0, y: 0};

            if(other instanceof EntityBase_player) {
                if(ig.game.units[ig.game.activeUnit].name === this.name) {
                    other.receiveDamage(1);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                }
                this.destination = this.pos;
                this.path = null;
            }
        },

        draw: function(){
            // Border/Background
            if(this.health < this.stat_maxHealth && this.hpBarTimer.delta() < 1.0) {
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 10) * ig.system.scale,
                    this.size.x * ig.system.scale,
                    6 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Health bar
                ig.system.context.fillStyle = 'rgb(255, 0, 0)';
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x + 1) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 9) * ig.system.scale,
                    ((this.size.x - 2) * (this.health / this.stat_maxHealth)) * ig.system.scale,
                    3 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();
            }
            this.parent();
        },

        receiveDamage: function(amount, from) {
            this.parent(amount);
            this.hpBarTimer.reset();
        },

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        }
    })
});
