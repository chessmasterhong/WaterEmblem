/**
 *  base_enemy.js
 *  -----
 *  Base enemy unit. This is an abstract entity that should be extended.
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
        collides: ig.Entity.COLLIDES.NEVER,

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
        stat_move_max: 4,
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
            if(ig.game.units[ig.game.activeUnit] === this) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Visual delay between generating path and moving unit along path
                    if(this.pathTimer.delta() > 0.6) {
                        if(this.destination !== null && (
                           this.pos.x !== this.destination.x ||
                           this.pos.y !== this.destination.y)) {
                            // Move along determined path
                            this.followPath(this.speed, true);

                            // Quickfix for improper grid alignment when pathfinding; let unit know pathfinding destination has been reached
                            if(this.vel.x === 0 && this.vel.y === 0) this.pos = this.destination;
                            else if(this.vel.x > 0) this.currentAnim = this.anims.right;
                            else if(this.vel.x < 0) this.currentAnim = this.anims.left;
                            else if(this.vel.y > 0) this.currentAnim = this.anims.down;
                            else if(this.vel.y < 0) this.currentAnim = this.anims.up;
                        } else {
                            this.vel = {x: 0, y: 0};
                            this.realignToGrid();

                            if(player !== null) {
                                // Destination reached, reset destination and advance activeUnit to next unit
                                this.destination = null;
                                this.turnUsed = true;
                            } else {
                                ig.game.end_battle = true;
                            }
                        }
                    } else if(this.pathTimer.delta() > 0.4) {
                        // Create and display path
                        if(this.destination === null) {
                            var player = this.selectBestTarget(ig.game.getEntitiesByType('EntityBase_player'));
                            if(player !== null) {
                                this.getPath(player.pos.x, player.pos.y, false, this.entitiesAvoid, this.entitiesIgnore);
                                this.realignToGrid();
                                this.pathTimer.reset();

                                if(this.path !== null)
                                    this.destination = ig.global.alignToGrid(this.path[this.path.length - 1].x, this.path[this.path.length - 1].y);
                            } /*else {
                                this.turnUsed = true;
                            }*/
                        }
                    }
                }
            } else {
                this.pathTimer.reset();
                this.currentAnim = this.anims.idle;
            }
        },
        
        /*clicked: function() {
            ig.game.clickedUnit = this;
        },*/

        /**
         *  object selectBestTarget(array targetable_units)
         *
         *  targetable_units must be an array of objects consisting of
         *  targetable units. This is usually called through
         *  ig.game.getEntityByName('EntityName'), or
         *  ig.game.getEntitiesByType('EntityType').
         *
         *  Returns an object of the target unit that satisfies the AI
         *  conditions.
         *
         *  Unit target priority:
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
        selectBestTarget: function(targetable_units) {
            // TODO: Optimize all of this stuff...

            // There are targetable units
            if(targetable_units.length > 0) {
                // Set initial min/max values
                var min_health = Number.POSITIVE_INFINITY;
                var min_distance = Number.POSITIVE_INFINITY;
                var max_damage = Number.NEGATIVE_INFINITY;

                var player_inRange = [];
                var player_inRange_minHealth = [];
                var player_inRange_minHealth_maxDamage = [];
                var player_inRange_minHealth_maxDamage_minDistance = [];

                // Do distance check against targetable units and pick those reachable in this turn
                console.log(this.name + ': Finding reachable units');
                for(var p = 0; p < targetable_units.length; p++) {
                    var d = Math.abs(this.pos.x - targetable_units[p].pos.x) + Math.abs(this.pos.y - targetable_units[p].pos.y);

                    // Create new array with reachable targets
                    if(d <= Math.round(this.maxMovement))
                        player_inRange.push(targetable_units[p]);
                }

                // There are reachable units
                if(player_inRange.length > 0) {
                    // Sort unit order by ascending health and select lowest value
                    console.log(this.name + ': Finding reachable, lowest health units');
                    player_inRange.sort(function(unit_0, unit_1) { return unit_0.health - unit_1.health; });
                    min_health = player_inRange[0].health;

                    // Create new array with reachable, lowest health targets
                    for(var p = 0; p < player_inRange.length; p++) {
                        if(player_inRange[p].health === min_health) {
                            player_inRange_minHealth.push(player_inRange[p]);
                        }
                    }

                    // Only one reachable, lowest health unit
                    if(player_inRange_minHealth.length === 1) {
                        console.log(this.name + ': Targeting ' + player_inRange_minHealth[0].name + ' with lowest health');
                        return player_inRange_minHealth[0]; // Target that unit
                    // More than one reachable, lowest health unit
                    } else if(player_inRange_minHealth.length > 1) {
                        // If main character is one of reachable, lowest health unit
                        for(var p = 0; p < player_inRange_minHealth.length; p++) {
                            if(player_inRange_minHealth[p].name === 'player_main') {
                                console.log(this.name + ': Targeting main character');
                                return player_inRange_minHealth[p]; //Target main character
                            }
                        }

                        // If main character not found, reachable, lowest health, highest damage units
                        console.log(this.name + ': Finding reachable, lowest health, highest damage units');
                        player_inRange_minHealth.sort(function(unit_0, unit_1) { return unit_1.damage - unit_0.damage; });
                        max_damage = player_inRange_minHealth[0].damage;

                        // Create new array with reachable, lowest health, highest damage targets
                        for(var p = 0; p < player_inRange_minHealth.length; p++) {
                            if(player_inRange_minHealth[p].damage === max_damage)
                                player_inRange_minHealth_maxDamage.push(player_inRange_minHealth[p]);
                        }

                        // Only one reachable, lowest health, highest damage unit
                        if(player_inRange_minHealth_maxDamage.length === 1) {
                            console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage[0].name);
                            return player_inRange_minHealth_maxDamage[0]; // Target that unit
                        // More than one reachable, lowest health, highest damage unit
                        } else if(player_inRange_minHealth_maxDamage.length > 1) {
                            // If main character is one of reachable, lowest health, highest damage unit
                            for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                if(player_inRange_minHealth_maxDamage[p].name === 'player_main') {
                                    console.log(this.name + ': Targeting main character');
                                    return player_inRange_minHealth_maxDamage[p]; //Target main character
                                }
                            }

                            // If main character not found, find reachable, lowest health, highest damage, closest distance units
                            console.log(this.name + ': Finding reachable, lowest health, highest damage, closest distance units');
                            for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                var d = this.distanceTo(player_inRange_minHealth_maxDamage[p]);
                                if(d < min_distance)
                                    min_distance = d;
                            }

                            // Create new array with reachable, lowest health, highest damage, closest distance units
                            for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                if(this.distanceTo(player_inRange_minHealth_maxDamage[p]) === min_distance)
                                    player_inRange_minHealth_maxDamage_minDistance.push(player_inRange_minHealth_maxDamage[p]);
                            }

                            // Only one reachable, lowest health, highest damage, closest distance unit
                            if(player_inRange_minHealth_maxDamage_minDistance.length === 1) {
                                console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage_minDistance[0].name);
                                return player_inRange_minHealth_maxDamage_minDistance[0]; // Target that unit
                            // More than one reachable, lowest health, highest damage, closest distance unit
                            } else if(player_inRange_minHealth_maxDamage_minDistance.length > 1) {
                                // If main character is one of reachable, lowest health, highest damage, closest distance unit
                                for(var p = 0; p < player_inRange_minHealth_maxDamage_minDistance.length; p++) {
                                    if(player_inRange_minHealth_maxDamage_minDistance[p].name === 'player_main') {
                                        console.log(this.name + ': Targeting main character');
                                        return player_inRange_minHealth_maxDamage_minDistance[p]; //Target main character
                                    }
                                }

                                // If main character not found, target first unit to have minimum distance
                                console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage_minDistance[0].name);
                                return player_inRange_minHealth_maxDamage_minDistance[0];
                            }
                        }
                    }
                // There are no reachable units
                } else {
                    // Find closest distance unit on map
                    console.log(this.name + ': Finding closest distance unit on map');
                    min_distance = Number.POSITIVE_INFINITY; // Reset min_distance
                    for(var p = 0; p < targetable_units.length; p++) {
                        var d = this.distanceTo(targetable_units[p]);
                        if(d < min_distance)
                            min_distance = d;
                    }

                    // Target first unit to have closest distance on map
                    for(var p = 0; p < targetable_units.length; p++) {
                        if(this.distanceTo(targetable_units[p]) === min_distance) {
                            console.log(this.name + ': Targeting ' + targetable_units[p].name);
                            return targetable_units[p];
                        }
                    }
                }
            // There are no targetable units
            } else {
                console.log(this.name + ': No targets available');
                return null;
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
            //this.realignToGrid();

            // Lock the unit in place and prevent unit from sliding due to collision
            this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y);
            this.vel = {x: 0, y: 0};

            if(other instanceof EntityBase_player) {
                //other.pos = ig.global.alignToGrid(other.pos.x, other.pos.y);
                if(ig.game.units[ig.game.activeUnit] === this) {
                    other.receiveDamage(1);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                }
                this.destination = this.pos;
                this.path = null;
            }
        },

        draw: function() {
            this.parent();

            // Border/Background
            if(this.health < this.stat_maxHealth && this.hpBarTimer.delta() < 0.6) {
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

            // Available movement tiles
            //if((ig.game.units[ig.game.activeUnit] === this && this.destination === null) || (ig.game.units[ig.game.activeUnit] !== this && ig.game.clickedUnit === this)) {
            if(ig.game.units[ig.game.activeUnit] === this && this.destination === null) {
                var ctx = ig.system.context;
                var mid = this.stat_move_max + 1;

                for(var i = 0; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper left quadrant border tiles
                        ctx.fillRect(
                            this.pos.x - (this.stat_move_max - i) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.pos.y - i * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower left quadrant border tiles
                        if(i !== 0) {
                            ctx.fillRect(
                                this.pos.x - (this.stat_move_max - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y + i * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );
                        }
                    ctx.restore();

                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        for(var j = 1; j <= i; j++) {
                            // Draw upper left quadrant fill tiles
                            ctx.fillRect(
                                this.pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower left quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        }
                    ctx.restore();
                }

                for(var i = 1; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper right quadrant border tiles
                        ctx.fillRect(
                            this.pos.x + (mid - i) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower right quadrant border tiles
                        if(i !== 1) {
                            ctx.fillRect(
                                this.pos.x + (mid - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );
                        }
                    ctx.restore();

                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        for(var j = 1; j < i; j++) {
                            // Draw upper right quadrant fill tiles
                            ctx.fillRect(
                                this.pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower right quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        }
                    ctx.restore();
                }
            }
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
