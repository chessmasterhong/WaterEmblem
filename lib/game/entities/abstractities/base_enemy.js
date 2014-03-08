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
        //collides: ig.Entity.COLLIDES.NEVER,

        // Collision box size
        size: {x: 32, y: 32},
        init_pos: {x: 0, y: 0},

        // Begin pathfinding and movement properties ---------------------------
        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        destination: null,

        // Avoid these entities when pathfinding (must be an array of strings)
        entitiesAvoid: [],

        // Ignore these entities when pathfinding (must be an array of variables)
        entitiesIgnore: [],

        // Current and maximum movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with stat.speed
        // End pathfinding and movement properties -----------------------------

        // Begin character development system ----------------------------------
        level: 1,
        kill_exp: 50, // Experience points gained when this unit is defeated. Applies only to player units.

        health_max: 10,

        // Core stats
        stat: {
            str: 1, // Strength
            mag: 1, // Magic
            skl: 1, // Skill
            def: 1, // Defense
            res: 1, // Resistance
            spd: 1, // Speed
            luk: 1, // Luck
            mov: 4, // Movement points (radius in tiles)
            crit: 0, // Critical Hit Rate
            wt: 0, // Unit's base weight
            hit: 0, // Unit's base hit rate

        },

        derived_stats: {
            atk: 5, // Computed by adding mods from weapons + base stat STR.
            hit_rate: 50, // Computed by mods from weapons + base stat HIT.
            crit_rate: 0, // Computed by mods from weapons + base stat CRIT.
            weight: 0, // Computed by mods from weapons + base stat WT.
            attack_speed: 0,
            evade: 0,
        },

        // Resistances
        resist: {
            // Status effects
            poison: 0,   // Poison status resistance
            blind: 0,    // Blind status resistance
            paralyze: 0, // Paralyze status resistance
            daze: 0,     // Daze status resistance
            sleep: 0,    // Sleep status resistance
            confuse: 0   // Confuse status resistance
        },

        // Modifiers (from buffs/debuffs, equipments, class bonuses, etc.)
        mod: {
            health_max: 0,
            atk: 0, mag: 0, def: 0, res: 0, spd: 0, luk: 0,
            poison: 0, blind: 0, paralyze: 0, daze: 0, sleep: 0, confuse: 0
        },

        // Status effects
        status: {
            isPoisoned: false,
            isBlinded: false,
            isParalyzed: false,
            isDazed: false,
            isAsleep: false,
            isConfused: false
        },
        // End character development system ------------------------------------

        selectedTargetToAttack: false,
        atk_dist: 1, // Attack distance (radius in tiles)
        item: ['', '', '', '', ''],

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pathTimer = new ig.Timer();
            this.hpBarTimer = new ig.Timer();

            this.health_max = this.health;
            this.init_pos = this.pos;
            
            this.itemCatalog = new ItemCatalog();

            this.item[0] = this.itemCatalog.sword1;
            var stat = ig.game.recomputeStats(this);
            console.log(stat);
          

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat.mov * ig.global.tilesize - 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.
        },

        update: function() {
            this.parent();

            // Only compute path if this unit is the active unit
            if(ig.game.units[ig.game.activeUnit] === this) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Visual delay between generating path and moving unit along path
                    if(this.pathTimer.delta() > 0.6) {
                        if(this.destination !== null && (this.pos.x !== this.destination.x || this.pos.y !== this.destination.y)) {
                            // Move along determined path
                            this.followPath(this.speed, true);
                            this.selectedTargetToAttack = false;

                            // Quickfix for improper grid alignment when pathfinding; let unit know pathfinding destination has been reached
                            if(this.vel.x === 0 && this.vel.y === 0) this.destination = this.pos;
                            else if(this.vel.x > 0) this.currentAnim = this.anims.right;
                            else if(this.vel.x < 0) this.currentAnim = this.anims.left;
                            else if(this.vel.y > 0) this.currentAnim = this.anims.down;
                            else if(this.vel.y < 0) this.currentAnim = this.anims.up;
                        } else {
                            // Destination reached, reset destination and advance activeUnit to next unit
                            this.vel = {x: 0, y: 0};
                            this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                            this.destination = null;
                            this.init_pos = this.pos;

                            // Nearby enemy unit detection
                            // Search nearby tiles based on attack distance
                            var atk_tile_search = []; // Tiles to search for attack
                            var mid = this.atk_dist + 1;

                            for(var i = 0; i < mid; i++) {
                                atk_tile_search.push({pos_x: this.pos.x - (this.atk_dist - i) * ig.global.tilesize, pos_y: this.pos.y - i * ig.global.tilesize});

                                if(i !== 0)
                                    atk_tile_search.push({pos_x: this.pos.x - (this.atk_dist - i) * ig.global.tilesize, pos_y: this.pos.y + i * ig.global.tilesize});
                            }

                            for(var i = 1; i < mid; i++) {
                                atk_tile_search.push({pos_x: this.pos.x + (mid - i) * ig.global.tilesize, pos_y: this.pos.y - (i - 1) * ig.global.tilesize});

                                if(i !== 1)
                                    atk_tile_search.push({pos_x: this.pos.x + (mid - i) * ig.global.tilesize, pos_y: this.pos.y + (i - 1) * ig.global.tilesize});
                            }

                            // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                            // For those that returns a unit (collided unit), push that unit to potential targets array.
                            // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                            //var targets = [];
                            for(var i = 0; i < atk_tile_search.length; i++) {
                                var ent = ig.game.spawnEntity(EntityTile_dummy, atk_tile_search[i].pos_x, atk_tile_search[i].pos_y);
                                var detected_unit = ent.checkEntities();
                                if(typeof detected_unit !== 'undefined' && detected_unit.unitType === 'player')
                                    ig.game.targets.push(detected_unit);
                                ent.kill();
                            }

                            if(!this.selectedTargetToAttack) {
                                if(ig.game.targets.length > 0) {
                                    // Select target to attack
                                    ig.game.targetedUnit = ig.game.targets[0];

                                    // All combat preparations are set; signal main game to wait for user to select target
                                    ig.game.battleAnimStage = 'attack';
                                    this.selectedTargetToAttack = true;
                                } else
                                    this.turnUsed = true;
                            }
                        }
                    } else if(this.pathTimer.delta() > 0.4) {
                        // Create and display path
                        if(this.destination === null) {
                            var target = this.selectBestTarget(ig.game.getEntitiesByType('EntityBase_player'));
                            if(target !== null) {
                                this.getPath(target.pos.x, target.pos.y, false, this.entitiesAvoid, this.entitiesIgnore);
                                this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                                this.pathTimer.reset();

                                if(this.path !== null)
                                    this.destination = ig.global.alignToGrid(this.path[this.path.length - 1].x + ig.global.tilesize / 2, this.path[this.path.length - 1].y + ig.global.tilesize / 2);
                            } /*else {
                                this.turnUsed = true;
                            }*/
                        }
                    }
                }
            } else {
                this.pathTimer.reset();
                this.path = null;
                this.currentAnim = this.anims.idle;
            }
        },

        leftClicked: function() {
            ig.game.clickedUnit = ig.game.targetedUnit = this;
        },

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
                //console.log(this.name + ': Finding reachable units');
                for(var p = 0; p < targetable_units.length; p++) {
                    var d = Math.abs(this.pos.x - targetable_units[p].pos.x) + Math.abs(this.pos.y - targetable_units[p].pos.y);

                    // Create new array with reachable targets
                    if(d <= Math.round(this.maxMovement))
                        player_inRange.push(targetable_units[p]);
                }

                // There are reachable units
                if(player_inRange.length > 0) {
                    // Sort unit order by ascending health and select lowest value
                    //console.log(this.name + ': Finding reachable, lowest health units');
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
                        //console.log(this.name + ': Targeting ' + player_inRange_minHealth[0].name + ' with lowest health');
                        return player_inRange_minHealth[0]; // Target that unit
                    // More than one reachable, lowest health unit
                    } else if(player_inRange_minHealth.length > 1) {
                        // If main character is one of reachable, lowest health unit
                        for(var p = 0; p < player_inRange_minHealth.length; p++) {
                            if(player_inRange_minHealth[p].name === ig.global.main_player_name) {
                                //console.log(this.name + ': Targeting main character');
                                return player_inRange_minHealth[p]; //Target main character
                            }
                        }

                        // If main character not found, reachable, lowest health, highest damage units
                        //console.log(this.name + ': Finding reachable, lowest health, highest damage units');
                        player_inRange_minHealth.sort(function(unit_0, unit_1) { return unit_1.stat.atk - unit_0.stat.atk; });
                        max_damage = player_inRange_minHealth[0].stat.atk;

                        // Create new array with reachable, lowest health, highest damage targets
                        for(var p = 0; p < player_inRange_minHealth.length; p++) {
                            if(player_inRange_minHealth[p].stat.atk === max_damage)
                                player_inRange_minHealth_maxDamage.push(player_inRange_minHealth[p]);
                        }

                        // Only one reachable, lowest health, highest damage unit
                        if(player_inRange_minHealth_maxDamage.length === 1) {
                            //console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage[0].name);
                            return player_inRange_minHealth_maxDamage[0]; // Target that unit
                        // More than one reachable, lowest health, highest damage unit
                        } else if(player_inRange_minHealth_maxDamage.length > 1) {
                            // If main character is one of reachable, lowest health, highest damage unit
                            for(var p = 0; p < player_inRange_minHealth_maxDamage.length; p++) {
                                if(player_inRange_minHealth_maxDamage[p].name === ig.global.main_player_name) {
                                    //console.log(this.name + ': Targeting main character');
                                    return player_inRange_minHealth_maxDamage[p]; //Target main character
                                }
                            }

                            // If main character not found, find reachable, lowest health, highest damage, closest distance units
                            //console.log(this.name + ': Finding reachable, lowest health, highest damage, closest distance units');
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
                                //console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage_minDistance[0].name);
                                return player_inRange_minHealth_maxDamage_minDistance[0]; // Target that unit
                            // More than one reachable, lowest health, highest damage, closest distance unit
                            } else if(player_inRange_minHealth_maxDamage_minDistance.length > 1) {
                                // If main character is one of reachable, lowest health, highest damage, closest distance unit
                                for(var p = 0; p < player_inRange_minHealth_maxDamage_minDistance.length; p++) {
                                    if(player_inRange_minHealth_maxDamage_minDistance[p].name === ig.global.main_player_name) {
                                        //console.log(this.name + ': Targeting main character');
                                        return player_inRange_minHealth_maxDamage_minDistance[p]; //Target main character
                                    }
                                }

                                // If main character not found, target first unit to have minimum distance
                                //console.log(this.name + ': Targeting ' + player_inRange_minHealth_maxDamage_minDistance[0].name);
                                return player_inRange_minHealth_maxDamage_minDistance[0];
                            }
                        }
                    }
                // There are no reachable units
                } else {
                    // Find closest distance unit on map
                    //console.log(this.name + ': Finding closest distance unit on map');
                    min_distance = Number.POSITIVE_INFINITY; // Reset min_distance
                    for(var p = 0; p < targetable_units.length; p++) {
                        var d = this.distanceTo(targetable_units[p]);
                        if(d < min_distance)
                            min_distance = d;
                    }

                    // Target first unit to have closest distance on map
                    for(var p = 0; p < targetable_units.length; p++) {
                        if(this.distanceTo(targetable_units[p]) === min_distance) {
                            //console.log(this.name + ': Targeting ' + targetable_units[p].name);
                            return targetable_units[p];
                        }
                    }
                }
            // There are no targetable units
            } else {
                //console.log(this.name + ': No targets available');
                return null;
            }
        },

        check: function(other) {
            this.parent(other);

            if(other instanceof EntityBase_player) {
                // Lock the unit in place and prevent unit from sliding due to collision
                this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                this.vel = {x: 0, y: 0};

                if(ig.game.units[ig.game.activeUnit] === this)
                    this.destination = null;
            }
        },

        draw: function() {
            this.parent();

            // Border/Background
            if(this.health < this.health_max && this.hpBarTimer.delta() < 0.6) {
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
                        ((this.size.x - 2) * (this.health / this.health_max)) * ig.system.scale,
                        3 * ig.system.scale
                    );
                ig.system.context.closePath();
                ig.system.context.fill();
            }

            // Available movement tiles
            //if((ig.game.units[ig.game.activeUnit] === this && this.destination === null) || (ig.game.units[ig.game.activeUnit] !== this && ig.game.clickedUnit === this)) {
            if(ig.game.units[ig.game.activeUnit] === this && !this.turnUsed) {
                var ctx = ig.system.context;
                var mid = this.stat.mov + 1;

                for(var i = 0; i <= mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper left quadrant border tiles
                        ctx.fillRect(
                            this.init_pos.x - (this.stat.mov - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.init_pos.y - i * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower left quadrant border tiles
                        if(i !== 0) {
                            ctx.fillRect(
                                this.init_pos.x - (this.stat.mov - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y + i * ig.global.tilesize - ig.game.screen.y + 1,
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
                                this.init_pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower left quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.init_pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        }
                    ctx.restore();
                }

                for(var i = 1; i <= mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper right quadrant border tiles
                        ctx.fillRect(
                            this.init_pos.x + (mid - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.init_pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower right quadrant border tiles
                        if(i !== 1) {
                            ctx.fillRect(
                                this.init_pos.x + (mid - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
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
                                this.init_pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower right quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.init_pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
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
            // Damage/Recovery amount handling
            if((from instanceof EntityBase_player && amount < 0) || // Prevent player units from healing enemy units
               (from instanceof EntityBase_enemy  && amount > 0))   // Prevent friendly fire (?)
                amount = 0;

            this.parent(amount, from);
            this.hpBarTimer.reset();
            console.log(this.name + ' attacks and inflicts ' + amount + ' damage to ' + from.name + '!');
        },

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        }
    })
});
