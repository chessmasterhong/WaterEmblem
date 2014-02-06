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
                            /*  Unit target priority:
                             *  The priority in which this unit will execute its target selection AI to perform pathfinding.
                             *
                             *  1. If at least one unit can be reached and attacked this turn...
                             *      a. Target unit with lowest health (within reachable range).
                             *          //1. If multiple units have lowest health and main character is one of the units with lowest health, target main character.
                             *          2. Otherwise, proceed to [1b].
                             *      b. Target unit capable of inflicting highest damage (within reachable range).
                             *          //1. If multiple units have highest damage and main character is one of the units with highest damage, target main character.
                             *          2. Otherwise, proceed to [1c].
                             *      c. Target closest unit (within reachable range).
                             *          //1. If multiple units are closest and main character is one of the units that is closest, target main character.
                             *          2. Otherwise, proceed to [2].
                             *  2. If no units can be reached and attacked this turn...
                             *      a. Target closest unit (anywhere on map).
                             */
                            var playerAll = ig.game.getEntitiesByType('EntityBase_player');
                            var player = playerAll;
                            if(player !== null) {
                                var min_health = Number.POSITIVE_INFINITY;
                                var min_distance = Number.POSITIVE_INFINITY;
                                var max_damage = Number.NEGATIVE_INFINITY;
                                
                                var player_inRange = [];
                                var player_inRange_minHealth = [];
                                var player_inRange_minHealth_maxDamage = [];
                                
                                // Do distance check against target units it can reach in this turn
                                for(var p = 0; p < player.length; p++) {
                                    var d = Math.abs(this.pos.x - player[p].pos.x) + Math.abs(this.pos.y - player[p].pos.y);
                                    
                                    // Create new array with in-range targets
                                    if(d <= this.maxMovement)
                                        player_inRange.push(player[p]);
                                }

                                if(player_inRange.length > 1) {
                                    // Sort unit order by ascending health and select lowest value
                                    player_inRange.sort(
                                        function(unit_0, unit_1) {
                                            return unit_0.health - unit_1.health;
                                        }
                                    );
                                    min_health = player_inRange[0].health;
                                    
                                    // When last element reached, create new aray of in-range targets that has minimum health
                                    for(var p = 0; p < player_inRange.length; p++) {
                                        if(player_inRange[p].health === min_health)
                                            player_inRange_minHealth.push(player_inRange[p]);
                                    }
                                    
                                    // If only one unit is in-range and has minimum health --> target = that unit
                                    if(player_inRange_minHealth.length === 1)
                                        player = player_inRange_minHealth[0];
                                    // If more than one unit is in-range and has minimum health --> target unit that does the most damage
                                    else {
                                        // Sort unit order by descending damage and select highest value
                                        player_inRange_minHealth.sort(
                                            function(unit_0, unit_1) {
                                                return unit_1.damage - unit_0.damage;
                                            }
                                        );
                                        max_damage = player_inRange_minHealth[0].damage;
                                    }
                                    
                                    // When last element reached, create new aray of in-range targets that has minimum health and maximum damage
                                    for(var p = 0; p < player_inRange_minHealth.length; p++) {
                                        if(player_inRange_minHealth[p].damage === max_damage)
                                            player_inRange_minHealth_maxDamage.push(player_inRange_minHealth[p]);
                                    }
                                    
                                    // If only one unit is in-range, has minimum health, and has maximum damage --> target = that unit
                                    if(player_inRange_minHealth_maxDamage.length === 1)
                                        player = player_inRange_minHealth_maxDamage[0];
                                    // If more than one unit is in-range, has minimum health, and has maximum damage --> target = closet unit
                                    else {
                                        for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                            var d = this.distanceTo(player[p]);
                                            
                                            // Find closet unit
                                            if(d < min_distance)
                                                min_distance = d;
                                        }
                                    }
                                    
                                    // When last element reached, create new aray of in-range targets that has minimum health, maximum damage, and closest distance
                                    if(player_inRange_minHealth_maxDamage.length > 0) {
                                        for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                            if(this.distanceTo(player_inRange_minHealth_maxDamage[p]) === min_distance) {
                                                player = player_inRange_minHealth_maxDamage[p];
                                                break;
                                            }
                                        }
                                    
                                    }
                                // If no targets are in-range, target closest target on the map
                                } else {
                                    min_distance = Number.POSITIVE_INFINITY; // Reset min_distance
                                    for(var p = 0; p < playerAll.length; p++) {
                                        var d = this.distanceTo(playerAll[p]);
                                        if(d < min_distance)
                                            min_distance = d;
                                    }
                                    
                                    for(var p = 0; p < playerAll.length; p++) {
                                        if(this.distanceTo(playerAll[p]) === min_distance) {
                                            player = playerAll[p];
                                            break;
                                        }
                                    }
                                }

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
