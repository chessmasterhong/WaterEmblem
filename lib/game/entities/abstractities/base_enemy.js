/**
 *  base_enemy.js
 *  -----
 *  Base enemy unit. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.base_enemy'
)
.requires(
    'impact.entity'
    //'plugins.gridmovement.gridmovement'
)
.defines(function() {
    'use strict';

    ig.global.EntityBase_enemy = ig.Entity.extend({
        entityClassName: [null],

        unitType: 'enemy',
        turnUsed: false,

        name: 'enemy',
        classType: null,

        modal: new ig.Image('media/modal/enemy_modal.png'),

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
        entitiesAvoid: ['EntityBase_enemy'],

        // Ignore these entities when pathfinding (must be an array of variables)
        entitiesIgnore: [],

        exp_curr: 0,

        // Current and maximum movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with stat.speed
        // End pathfinding and movement properties -----------------------------

        // Begin unit development system ---------------------------------------
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
            hit: 0 // Unit's base hit rate

        },

        derived_stats: {
            atk: 5, // Computed by adding mods from weapons + base stat STR.
            hit_rate: 50, // Computed by mods from weapons + base stat HIT.
            crit_rate: 0, // Computed by mods from weapons + base stat CRIT.
            weight: 0, // Computed by mods from weapons + base stat WT.
            attack_speed: 0,
            evade: 0
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
            atk: 0, mag: 0, def: 0, res: 0, spd: 0, luk: 0, hit: 0,
            poison: 0, blind: 0, paralyze: 0, daze: 0, sleep: 0, confuse: 0
        },

        // Modifiers from terrain
        terrainMod: {
            avoid: 0,
            def: 0
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
        // End unit development system -----------------------------------------

        // Begin unit equipment and inventory system ---------------------------
        item: [null], // Unit can hold up to 5 items; item[0] is reserved for equipped weapon
        item_uses: [0, 0, 0, 0, 0], // Item usage/durability for each respective inventory slot
        // End unit equipment and inventory system -----------------------------
        validWeapon: [null, null, null, null, null], // Items that can be equipped: Swords, Lances, Axes, Spells, Staffs
        selectedTargetToAttack: false,
        atk_dist: 1, // Minimum attack distance (radius in tiles)
        atk_area: 1, // Attack area extending from minimum attack distance (radius in tiles)

        waitUntilTurn: 0, // The turn in which this unit will start performing their action, otherwise it will skip its turn
        immovable: false, // Determines if this unit can move; This does not affect its ability to attack (only its movement)

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pathTimer = new ig.Timer();
            //this.hpBarTimer = new ig.Timer();

            this.health = this.health_max;
            this.init_pos = this.pos;

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat.mov > 0 ? this.stat.mov * ig.global.tilesize - 0.0001 : 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13, 19]);
            this.addAnim('right', 0.28, [2, 8, 14, 20]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11, 17]);
        },

        update: function() {
            this.parent();

            // Only compute path if this unit is the active unit
            if(ig.game.units[ig.game.activeUnit] === this && ig.game.battleState !== 'enemy_phase') {
                // Detect if any player unit is within this unit's movement distance and break waiting until turn to perform action
                this.selectBestTarget(ig.game.getEntitiesByType('EntityBase_player'), true);

                // Check if this unit can perform their action based on game turn counter
                if(ig.game.turn_counter >= this.waitUntilTurn) {
                    // Check if this unit moved for this turn
                    if(!this.turnUsed) {
                        // Visual delay between generating path and moving unit along path
                        if(this.pathTimer.delta() > 0.6) {
                            if(this.immovable === false && this.destination !== null && (this.pos.x !== this.destination.x || this.pos.y !== this.destination.y)) {
                                // Move along determined path
                                this.followPath(this.speed, true);
                                this.selectedTargetToAttack = false;

                                // Quickfix for improper grid alignment when pathfinding; let unit know pathfinding destination has been reached
                                if(this.vel.x === 0 && this.vel.y === 0) { this.destination = this.pos;         }
                                else if(this.vel.x > 0)                  { this.currentAnim = this.anims.right; }
                                else if(this.vel.x < 0)                  { this.currentAnim = this.anims.left;  }
                                else if(this.vel.y > 0)                  { this.currentAnim = this.anims.down;  }
                                else if(this.vel.y < 0)                  { this.currentAnim = this.anims.up;    }
                            } else {
                                // Destination reached, reset destination and advance activeUnit to next unit
                                this.vel = {x: 0, y: 0};
                                this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                                this.destination = null;
                                this.init_pos = this.pos;

                                // Nearby enemy unit detection
                                // Search nearby tiles based on attack distance
                                var attack_tile_search = []; // Tiles to search for attacking

                                var i, j;

                                for(i = 1; i <= this.atk_area; i++) {
                                    for(j = 0; j <= this.atk_dist + i - 1; j++) {
                                        attack_tile_search.push({
                                            pos_x: this.pos.x - (this.atk_dist - j + i - 1) * ig.global.tilesize,
                                            pos_y: this.pos.y - j * ig.global.tilesize,
                                            distance: this.atk_dist - i + 1
                                        });

                                        if(i !== 0) {
                                            attack_tile_search.push({
                                                pos_x: this.pos.x - (this.atk_dist - j + i - 1) * ig.global.tilesize,
                                                pos_y: this.pos.y + j * ig.global.tilesize,
                                                distance: this.atk_dist - i + 1
                                            });
                                        }
                                    }
                                }

                                for(i = 1; i <= this.atk_area; i++) {
                                    for(j = 1; j <= this.atk_dist + i - 1; j++) {
                                        attack_tile_search.push({pos_x: this.pos.x + (this.atk_dist - j + i) * ig.global.tilesize, pos_y: this.pos.y - (j - 1) * ig.global.tilesize});

                                        if(i !== 1) {
                                            attack_tile_search.push({
                                                pos_x: this.pos.x + (this.atk_dist - j + i) * ig.global.tilesize,
                                                pos_y: this.pos.y + (j - 1) * ig.global.tilesize,
                                                distance: this.atk_dist - i + 1
                                            });
                                        }
                                    }
                                }

                                for(i = 0; i < attack_tile_search.length; i++) {
                                    // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                                    var ent = ig.game.spawnEntity(
                                        ig.global.EntityTile_dummy,
                                        attack_tile_search[i].pos_x + ig.global.tilesize / 2,
                                        attack_tile_search[i].pos_y + ig.global.tilesize / 2,
                                        {distance: attack_tile_search[i].distance} // Keep track of distance from attacker
                                    );

                                    // For those that returns a unit that are enemies, push that unit to potential attack targets array.
                                    var detected_enemy_unit = ent.checkEntities();
                                    if(typeof detected_enemy_unit !== 'undefined' && detected_enemy_unit.unitType === 'player') {
                                        ig.game.attackTargets.push({unit: detected_enemy_unit, dist: ent.distance});
                                    }

                                    // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                                    ent.kill();
                                }

                                if(!this.selectedTargetToAttack) {
                                    if(ig.game.attackTargets.length > 0) {
                                        // Select target to attack
                                        ig.game.targetedUnit = ig.game.attackTargets[0].unit;
                                        ig.game.attackDistance = ig.game.attackTargets[0].dist;
                                        this.selectedTargetToAttack = true;

                                        // All combat preparations are set; signal main game to wait for user to select target
                                        ig.game.battleState = 'attack';
                                    } else {
                                        if(this.immovable === true) {
                                            if(this.pathTimer.delta() > 1.5) {
                                                this.turnUsed = true;
                                            }
                                        } else {
                                            this.turnUsed = true;
                                        }
                                    }
                                }
                            }
                        } else if(this.pathTimer.delta() > 0.4) {
                            // Create and display path
                            if(this.destination === null) {
                                var target = this.selectBestTarget(ig.game.getEntitiesByType('EntityBase_player'));
                                target = this.selectAdjacentTile(target);
                                if(this.immovable === false && target !== null) {
                                    try {
                                        this.getPath(target.pos.x, target.pos.y, false, [], this.entitiesIgnore, this.entitiesAvoid);
                                    } catch (e) {
                                        this.path = null;
                                        this.turnUsed = true;
                                    }
                                    this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                                    this.pathTimer.reset();

                                    if(this.path !== null) {
                                        this.destination = ig.global.alignToGrid(this.path[this.path.length - 1].x + ig.global.tilesize / 2, this.path[this.path.length - 1].y + ig.global.tilesize / 2);
                                    }
                                } /*else {
                                    this.turnUsed = true;
                                }*/
                            }
                        }
                    }
                } else {
                    if(this.pathTimer.delta() > 1.5) {
                        this.turnUsed = true;
                    }
                }
            } else {
                this.pathTimer.reset();
                this.path = null;
                this.currentAnim = this.anims.idle;
            }
        },

        leftClicked: function() {
            if(ig.game.battleState !== 'trading' && (ig.game.units[ig.game.activeUnit].unitType !== 'player' || ig.game.battleState === 'attack' ) && this._killed === false && ig.game.battleState !== 'shopping' && ig.game.battleState !== 'buying' && ig.game.battleState !== 'selling') {
                ig.game.clickedUnit = this;
                ig.game.targetedUnit = this;
            }
        },

        selectAdjacentTile: function(target) {
            var t = ig.game.collisionMap.tilesize;
            var tiles = [
                [target.pos.x - t, target.pos.y],
                [target.pos.x + t, target.pos.y],
                [target.pos.x, target.pos.y - t],
                [target.pos.x, target.pos.y + t],
            ];
            var _this = this;
            tiles.sort(function(a,b) {
                return  Math.sqrt(Math.pow((_this.pos.x - a[0]), 2) + Math.pow((_this.pos.y - a[1]), 2)) -
                        Math.sqrt(Math.pow((_this.pos.x - b[0]), 2) + Math.pow((_this.pos.y - b[1]), 2));
            });
            for (var i = 0; i < tiles.length; i++) {
                var tile = {
                    pos: {
                        x: tiles[i][0],
                        y: tiles[i][1]
                    },
                    size: {x: t, y: t}
                };
                var occ = false;
                for (var j = 0; j < ig.game.entities.length; j++) {
                    if (ig.game.entities[j].touches(tile) && ig.game.entities[j] == this) {
                        return target;
                    } else if (ig.game.entities[j].touches(tile)) {
                        occ = true;
                        break;
                    }
                }
                if (!occ) {
                    return tile;
                }
            }
            return null;
        },

        /**
         *  object selectBestTarget(array targetable_units)
         *  -----
         *  Selects the "best" unit out of all units available on the map to
         *  target and attack.
         *
         *  Precondition:
         *      targetable_units must be an array of objects consisting of
         *      targetable units. This is usually called through
         *      ig.game.getEntityByName('EntityName'), or
         *      ig.game.getEntitiesByType('EntityType').
         *
         *  Postcondition:
         *      Returns an object of the target unit that satisfies the AI
         *      conditions (shown in detail below).
         *
         *  Unit target priority:
         *      The priority in which the target will be selected (usually to
         *      perform pathfinding afterwards) are as follows:
         *
         *      1. If at least one unit can be reached and attacked this turn...
         *          a. Target unit with lowest health (within reachable range).
         *              1. If multiple units have lowest health and main
         *                 character is one of the units with lowest health,
         *                 target main character.
         *              2. Otherwise, proceed to [1b].
         *          b. Target unit capable of inflicting highest damage (within
         *             reachable range).
         *              1. If multiple units have highest damage and main
         *                 character is one of the units with highest damage,
         *                 target main character.
         *              2. Otherwise, proceed to [1c].
         *          c. Target closest unit (within reachable range).
         *              1. If multiple units are closest and main character is
         *                 one of the units that is closest, target main
         *                 character.
         *              2. Otherwise, proceed to [2].
         *      2. If no units can be reached and attacked this turn...
         *          a. Target closest unit (anywhere on map).
         */
        selectBestTarget: function(targetable_units, breakWaitTurn) {
            // There are targetable units
            if(targetable_units.length > 0) {
                var d, p, min_distance,
                    targets = [];

                // Do distance check against targetable units and pick those reachable in this turn
                //console.log(this.name + ': Finding reachable units');
                for(p = 0; p < targetable_units.length; p++) {
                    // Push to potential targets array with reachable targets
                    if(Math.abs(this.pos.x - targetable_units[p].pos.x) + Math.abs(this.pos.y - targetable_units[p].pos.y) <= Math.round(this.maxMovement)) {
                        // Premature return of method. Used to detect if any targetable unit is within movement distance and break waiting until turn to perform action.
                        if(breakWaitTurn === true) {
                            this.waitUntilTurn = 0;
                            return;
                        }

                        targets.push(targetable_units[p]);
                    }
                }

                // There are reachable units
                if(targets.length > 0) {
                    // Sort unit order by ascending health and select lowest value
                    //console.log(this.name + ': Finding reachable, lowest health units');
                    targets.sort(function(unit_0, unit_1) { return unit_0.health - unit_1.health; });

                    // Pop from potential targets array the reachable, non-lowest health targets
                    for(p = 0; p < targets.length; p++) {
                        // Since targets array is sorted by health, if we find first non-lowest health unit, we know all subsequent unit are non-lowest health too
                        if(targets[p].health !== targets[0].health) {
                            targets.splice(p, targets.length - p); // Pop all subsequent units
                            break; // Break for-loop because we popped all subsequent units already, no need to go through full loop
                        }
                    }

                    // Only one reachable, lowest health unit
                    if(targets.length === 1) {
                        //console.log(this.name + ': Targeting ' + targets[0].name + ' with lowest health');
                        return targets[0]; // Target that unit
                    // More than one reachable, lowest health unit
                    } else if(targets.length > 1) {
                        // If main character is one of reachable, lowest health unit
                        for(p = 0; p < targets.length; p++) {
                            if(targets[p].name === ig.global.main_player_name) {
                                //console.log(this.name + ': Targeting main character');
                                return targets[p]; //Target main character
                            }
                        }

                        // If main character not found, reachable, lowest health, highest damage units
                        //console.log(this.name + ': Finding reachable, lowest health, highest damage units');
                        targets.sort(function(unit_0, unit_1) { return unit_1.stat.atk - unit_0.stat.atk; });

                        // Pop from potential targets array the reachable, non-lowest health, non-highest damage targets
                        for(p = 0; p < targets.length; p++) {
                            // Since targets array is sorted by attack, if we find first non-highest damage unit, we know all subsequent unit are non-highest damage too
                            if(targets[p].stat.atk !== targets[0].stat.atk) {
                                targets.splice(p, targets.length - p); // Pop all subsequent units
                                break; // Break for-loop because we popped all subsequent units already, no need to go through full loop
                            }
                        }

                        // Only one reachable, lowest health, highest damage unit
                        if(targets.length === 1) {
                            //console.log(this.name + ': Targeting ' + targets[0].name);
                            return targets[0]; // Target that unit
                        // More than one reachable, lowest health, highest damage unit
                        } else if(targets.length > 1) {
                            // If main character is one of reachable, lowest health, highest damage unit
                            for(p = 0; p < targets.length; p++) {
                                if(targets[p].name === ig.global.main_player_name) {
                                    //console.log(this.name + ': Targeting main character');
                                    return targets[p]; //Target main character
                                }
                            }

                            // If main character not found, find reachable, lowest health, highest damage, closest distance units
                            //console.log(this.name + ': Finding reachable, lowest health, highest damage, closest distance units');
                            min_distance = Number.POSITIVE_INFINITY;
                            for(p = 0; p < targets.length; p++) {
                                d = this.distanceTo(targets[p]);
                                if(d < min_distance) {
                                    min_distance = d;
                                }
                            }

                            // Pop from potential targets array the reachable, non-lowest health, non-highest damage, non-closest distance units
                            for(p = 0; p < targets.length; p++) {
                                if(this.distanceTo(targets[p]) !== min_distance) {
                                    targets.splice(p, 1);
                                }
                            }

                            // Only one reachable, lowest health, highest damage, closest distance unit
                            if(targets.length === 1) {
                                //console.log(this.name + ': Targeting ' + targets[0].name);
                                return targets[0]; // Target that unit
                            // More than one reachable, lowest health, highest damage, closest distance unit
                            } else if(targets.length > 1) {
                                // If main character is one of reachable, lowest health, highest damage, closest distance unit
                                for(p = 0; p < targets.length; p++) {
                                    if(targets[p].name === ig.global.main_player_name) {
                                        //console.log(this.name + ': Targeting main character');
                                        return targets[p]; //Target main character
                                    }
                                }

                                // If main character not found, target first unit to have minimum distance
                                //console.log(this.name + ': Targeting ' + targets[0].name);
                                return targets[0];
                            }
                        }
                    }
                // There are no reachable units
                } else {
                    // Find closest distance unit on map
                    //console.log(this.name + ': Finding closest distance unit on map');
                    min_distance = Number.POSITIVE_INFINITY;
                    for(p = 0; p < targetable_units.length; p++) {
                        d = this.distanceTo(targetable_units[p]);
                        if(d < min_distance) {
                            min_distance = d;
                        }
                    }

                    // Target first unit to have closest distance on map
                    for(p = 0; p < targetable_units.length; p++) {
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

            if(other instanceof ig.global.EntityBase_player) {
                // Lock the unit in place and prevent unit from sliding due to collision
                this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                this.vel = {x: 0, y: 0};

                if(ig.game.units[ig.game.activeUnit] === this) {
                    this.destination = null;
                }
            }
        },

        draw: function() {
            this.parent();

            // Border/Background
            /*if(this.health < this.health_max && this.hpBarTimer.delta() < 0.6) {
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
            }*/

            // Begin selectable action tiles -----------------------------------
            //if((ig.game.units[ig.game.activeUnit] === this && this.destination === null) || (ig.game.units[ig.game.activeUnit] !== this && ig.game.clickedUnit === this)) {
            if(ig.game.units[ig.game.activeUnit] === this && !this.turnUsed) {
                var i, j,
                    ctx = ig.system.context;

                // Available movement tiles
                if(ig.game.attackTargets.length === 0) {
                    var mov = !this.immovable ? this.stat.mov : 0
                    var radius = mov + 1;
                    var range = this.atk_dist + this.atk_area - 1;

                    for(i = 1; i <= range; i++) {
                        for(j = 0; j <= radius + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                                // Draw upper left quadrant border tiles
                                ctx.fillRect(
                                    this.init_pos.x - (mov - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y - j * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower left quadrant border tiles
                                if(j !== 0) {
                                    ctx.fillRect(
                                        this.init_pos.x - (mov - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.init_pos.y + j * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }

                    for(i = 0; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                            for(j = 1; j <= i; j++) {
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

                    for(i = 1; i <= range; i++) {
                        for(j = 1; j <= radius + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                                // Draw upper right quadrant border tiles
                                ctx.fillRect(
                                    this.init_pos.x + (radius - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower right quadrant border tiles
                                if(j !== 1) {
                                    ctx.fillRect(
                                        this.init_pos.x + (radius - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.init_pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }

                    for(i = 1; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                            for(j = 1; j < i; j++) {
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
                // Available attack tiles
                } else {
                    for(i = 1; i <= this.atk_area; i++) {
                        for(j = 0; j <= this.atk_dist + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = ig.game.attackTargets.length > 0 ? 'rgba(255, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0)';

                                // Draw upper left quadrant border tiles
                                ctx.fillRect(
                                    this.pos.x - (this.atk_dist - j + i - 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y - j * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower left quadrant border tiles
                                if(j !== 0) {
                                    ctx.fillRect(
                                        this.pos.x - (this.atk_dist - j + i - 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.pos.y + j * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }

                    for(i = 1; i <= this.atk_area; i++) {
                        for(j = 1; j <= this.atk_dist + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = ig.game.attackTargets.length > 0 ? 'rgba(255, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0)';

                                // Draw upper right quadrant border tiles
                                ctx.fillRect(
                                    this.pos.x + (this.atk_dist - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower right quadrant border tiles
                                if(j !== 1) {
                                    ctx.fillRect(
                                        this.pos.x + (this.atk_dist - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }
                }
            }
            // End selectable action tiles -------------------------------------
        },

        receiveDamage: function(amount, from) {
            // Damage/Recovery amount handling
            if(
                (from instanceof ig.global.EntityBase_player && amount < 0) || // Prevent player units from healing enemy units
                (from instanceof ig.global.EntityBase_enemy  && amount > 0)    // Prevent friendly fire (?)
            ) {
                amount = 0;
            }

            this.parent(amount, from);

            if(this.health < 0) {
                this.health = 0;
            }

            //this.hpBarTimer.reset();
            console.log(from.name + ' attacks and inflicts ' + amount + ' damage to ' + this.name + '!');
        },

        kill: function() {
            this.parent();
            this.turnUsed = true;
            var firsthalf = ig.game.unitStats.slice(0, ig.game.unitStats.indexOf(this));
            var secondhalf = ig.game.unitStats.slice(ig.game.unitStats.indexOf(this) + 1, ig.game.unitStats.length);
            ig.game.unitStats = firsthalf.concat(secondhalf);
            ig.game.numEnemies -= 1;
            console.log(this.name + ' has been defeated.');
        }
    });
});