/**
 *  base_player.js
 *  -----
 *  Base player/playable unit. This is an abstract entity that should beextended.
 */

ig.module(
    'game.entities.abstractities.base_player'
)
.requires(
    'impact.entity',
    'game.entities.misc.pointer',
    'game.entities.misc.tile_dummy',

    'game.entities.menus.button_attack',
    'game.entities.menus.button_heal',
    'game.entities.menus.button_trade',
    'game.entities.menus.button_inventory',
    'game.entities.menus.button_wait',
    'game.entities.menus.button_armory'
    //'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_player = ig.Entity.extend({
        entityClassName: [null],

        unitType: 'player',
        turnUsed: false,

        name: 'player',

        // Collision types
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        //collides: ig.Entity.COLLIDES.NEVER,

        size: {x: 32, y: 32},
        init_pos: {x: 0, y: 0},

        // Begin pathfinding and movement properties ---------------------------
        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        pointer: null,
        destination: null,

        // Avoid these entities when pathfinding (must be an array of strings)
        entitiesAvoid: ['EntityBase_enemy'],

        // Ignore these entities when pathfinding (must be an array of variables)
        entitiesIgnore: [],

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with the stat.speed
        // End pathfinding and movement properties -----------------------------

        // Begin unit development system ---------------------------------------
        level: 1,
        exp_curr: 0,
        exp_levelUp: 100,

        health_max: 10,

        // Base stats
        stat: {
            str: 1,  // Strength
            mag: 1,  // Magic
            skl: 1,  // Skill
            def: 1,  // Defense
            res: 1,  // Resistance
            spd: 1,  // Speed
            luk: 1,  // Luck
            mov: 4,  // Movement points (radius in tiles)
            crit: 0, // Critical hit rate
            wt: 7,   // Base weight
            hit: 0   // Base hit rate
        },

        // Derived stats
        derived_stats: {
            atk: 0,          // Attack: computed by adding mods from weapons + base stat STR.
            hit_rate: 0,     // Hit rate: computed by mods from weapons + base stat HIT.
            crit_rate: 0,    // Critical hit rate: computed by mods from weapons + base stat CRIT.
            weight: 0,       // Weight: computed by mods from weapons + base stat WT.
            attack_speed: 0, // Attack speed:
            evade: 0         // Evade:
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
            atk: 0, mag: 0, def: 0, res: 0, spd: 0, luk: 0, // Base stats
            hit: 0, crit: 0, evade: 0, wt: 0, // Derived stats
            poison: 0, blind: 0, paralyze: 0, daze: 0, sleep: 0, confuse: 0 // Status effects
        },

        // Stat growth chance (on level up)
        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.1,
            skl: 0.4,
            def: 0.4,
            res: 0.4,
            spd: 0.7,
            luk: 0.8
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
        item: [null, null, null, null, null], // Unit can hold up to 5 items; item[0] is reserved for equipped weapon
        item_uses: [0, 0, 0, 0, 0], // Item usage/durability for each respective inventory slot

        selectedItemIndex: null,
        selectedWeapon: null, // Holds the selected weapon for possible equiping
        equippedWeapon: null, // Might be necessary for future durability checks
        isEquipping: false, // Are we currently inside of the equipping state?
        // End unit equipment and inventory system -----------------------------

        atk_dist: 1, // Minimum attack distance (radius in tiles)
        atk_area: 1, // Attack area extending from minimum attack distance (radius in tiles)

        mov_curr: 0,
        //tile_index: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pointer = ig.game.getEntityByName('pointer');

            this.idleTimer = new ig.Timer();
            //this.hpBarTimer = new ig.Timer();

            this.health = this.health_max;
            this.init_pos = this.pos;
            this.mov_curr = this.stat.mov;

            // Load grid movement
            //this.movement = new GridMovement(this);
            //this.movement.speed = {x: this.speed, y: this.speed};

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat.mov * ig.global.tilesize - 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13, 19]);
            this.addAnim('right', 0.28, [2, 8, 14, 20]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11, 17]);
        }, // End init method

        update: function() {
            this.parent();

            // Not in combat mode (ig.game.activeUnit = undefined)
            /*if(typeof ig.game.activeUnit === 'undefined') {
                // Update grid movement
                this.movement.update();
                if(ig.input.state('up'))         this.movement.direction = GridMovement.moveType.UP;
                else if(ig.input.state('down'))  this.movement.direction = GridMovement.moveType.DOWN;
                else if(ig.input.state('left'))  this.movement.direction = GridMovement.moveType.LEFT;
                else if(ig.input.state('right')) this.movement.direction = GridMovement.moveType.RIGHT;
            // In combat mode and is current active unit
            }*/

            if(ig.game.units[ig.game.activeUnit] === this) {
                // Proceed with unit's action if unit's turn is not used and game is not displaying menu
                if(!this.turnUsed && !ig.game.menuVisible) {
                    // Small timer to prevent instant unit movement (due to user input) when changing active unit to this unit
                    if(this.idleTimer.delta() > 0.2) {
                        // Update grid movement
                        //this.movement.update();

                        // Destination not set yet
                        if(this.mov_curr > 0) {
                            if(this.destination === null) {
                                // Wait for user's input (keyboard)
                                /*if(ig.input.state('up') || ig.input.state('down') || ig.input.state('left') || ig.input.state('right')) {
                                    var tile_pos_delta = {x: 0, y: 0};

                                    if(ig.input.state('up')) {
                                        this.currentAnim = this.anims.up;
                                        this.movement.direction = GridMovement.moveType.UP;
                                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y - ig.global.tilesize);
                                        tile_pos_delta.y = -ig.global.tilesize;
                                    } else if(ig.input.state('down')) {
                                        this.currentAnim = this.anims.down;
                                        this.movement.direction = GridMovement.moveType.DOWN;
                                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y + ig.global.tilesize);
                                        tile_pos_delta.y = ig.global.tilesize;
                                    } else if(ig.input.state('left')) {
                                        this.currentAnim = this.anims.left;
                                        this.movement.direction = GridMovement.moveType.LEFT;
                                        this.destination = ig.global.alignToGrid(this.pos.x - ig.global.tilesize, this.pos.y);
                                        tile_pos_delta.x = -ig.global.tilesize;
                                    } else if(ig.input.state('right')) {
                                        this.currentAnim = this.anims.right;
                                        this.movement.direction = GridMovement.moveType.RIGHT;
                                        this.destination = ig.global.alignToGrid(this.pos.x + ig.global.tilesize, this.pos.y);
                                        tile_pos_delta.x = ig.global.tilesize;
                                    }

                                    // Get terrain data
                                    var tile_pos = {
                                        x: Math.floor((this.pos.x + ig.global.tilesize / 2 + tile_pos_delta.x) / ig.global.tilesize),
                                        y: Math.floor((this.pos.y + ig.global.tilesize / 2 + tile_pos_delta.y) / ig.global.tilesize)
                                    }

                                    this.tile_index = ig.game.backgroundMaps[1].data[tile_pos.y][tile_pos.x];

                                    // Disallow movement if unit does not enough movement points to move to destination
                                    if(this.mov_curr - ig.game.terrain[this.tile_index].move < 0) {
                                        //this.currentAnim = this.anims.idle;
                                        this.movement.direction = null;
                                        this.destination = null;
                                    }
                                }*/

                                // Wait for user's input (mouse)
                                if(this.pointer.isLeftClicking) {
                                    // Check if pointer is within this unit's reachable distance this turn
                                    var unit_pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                                    var ptr_pos = ig.global.alignToGrid(this.pointer.pos.x, this.pointer.pos.y);
                                    var d = Math.abs((unit_pos.x - ptr_pos.x) + (unit_pos.y - ptr_pos.y));
                                    if(d <= Math.round(this.maxMovement) && ig.game.clickedUnit === this) {
                                        // Align pointer's position to grid and set as destination
                                        this.destination = ig.global.alignToGrid(this.pointer.pos.x, this.pointer.pos.y);
                                        this.getPath(this.destination.x, this.destination.y, false, this.entitiesAvoid, this.entitiesIgnore);
                                    }
                                }

                                if(this.mov_curr === this.stat.mov)
                                    this.init_pos = this.pos;
                            // Destination has been set
                            } else {
                                // Destination has been reached

                                // Keyboard-based movement check
                                //if((this.pos.x <= this.destination.x && this.last.x > this.destination.x) ||
                                //   (this.pos.x >= this.destination.x && this.last.x < this.destination.x) ||
                                //   (this.pos.y <= this.destination.y && this.last.y > this.destination.y) ||
                                //   (this.pos.y >= this.destination.y && this.last.y < this.destination.y)) {

                                // Mouse-based movement check
                                if(this.pos.x === this.destination.x && this.pos.y === this.destination.y) {
                                    // Reset destination and advance activeUnit to next unit
                                    this.vel = {x: 0, y: 0};
                                    this.destination = null;
                                    this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                                    this.mov_curr = 0;
                                    //this.mov_curr -= ig.game.terrain[this.tile_index].move;
                                } else {
                                    this.followPath(this.speed, true);

                                    // Quickfix for improper grid alignment when pathfinding; let unit know pathfinding destination has been reached
                                    if(this.vel.x === 0 && this.vel.y === 0) this.destination = this.pos;
                                    else if(this.vel.x > 0) this.currentAnim = this.anims.right;
                                    else if(this.vel.x < 0) this.currentAnim = this.anims.left;
                                    else if(this.vel.y > 0) this.currentAnim = this.anims.down;
                                    else if(this.vel.y < 0) this.currentAnim = this.anims.up;
                                }
                            }
                        // If unit used up all their movement points, end their turn
                        } else {
                            // #################################################
                            // Display menu
                            // #################################################
                            var menuButtonIndex = 0;

                            // Check if menu exists
                            if(typeof ig.game.getEntityByName('btn_wait') === 'undefined' && !ig.game.menuVisible) {
                                ig.game.menuVisible = true;

                                // Nearby unit detection
                                // Search nearby tiles based on attack distance
                                var attack_tile_search = []; // Tiles to search for attacking
                                var assist_tile_search = []; // Tiles to search for assisting
                                var trade_tile_search = [
                                    {pos_x: this.pos.x - ig.global.tilesize, pos_y: this.pos.y},
                                    {pos_x: this.pos.x, pos_y: this.pos.y - ig.global.tilesize},
                                    {pos_x: this.pos.x, pos_y: this.pos.y + ig.global.tilesize},
                                    {pos_x: this.pos.x + ig.global.tilesize, pos_y: this.pos.y}
                                ]; // Tiles to search for trading

                                if(this.item[0] !== null) {
                                    if(this.item[0].affinity !== 'staff') {
                                        attack_tile_search = this.unitsTIleSearch(this.atk_dist, this.atk_area);

                                        for(var i = 0; i < attack_tile_search.length; i++) {
                                            // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                                            var ent = ig.game.spawnEntity(
                                                EntityTile_dummy,
                                                attack_tile_search[i].pos_x + ig.global.tilesize / 2,
                                                attack_tile_search[i].pos_y + ig.global.tilesize / 2,
                                                {distance: attack_tile_search[i].distance} // Keep track of distance from attacker
                                            );

                                            // For those that returns a unit that are enemies, push that unit to potential attack targets array.
                                            var detected_enemy_unit = ent.checkEntities();
                                            if(typeof detected_enemy_unit !== 'undefined' && detected_enemy_unit.unitType === 'enemy')
                                                ig.game.attackTargets.push({unit: detected_enemy_unit, dist: ent.distance});

                                            // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                                            ent.kill();
                                        }
                                    } else {
                                        assist_tile_search = this.unitsTIleSearch(this.atk_dist, this.atk_area);

                                        for(var i = 0; i < assist_tile_search.length; i++) {
                                            // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                                            var ent = ig.game.spawnEntity(EntityTile_dummy, assist_tile_search[i].pos_x + ig.global.tilesize / 2, assist_tile_search[i].pos_y + ig.global.tilesize / 2);

                                            // For those that returns a unit that are enemies, push that unit to potential attack targets array.
                                            var detected_player_unit = ent.checkEntities();
                                            if(typeof detected_player_unit !== 'undefined' && detected_player_unit.unitType === 'player')
                                                ig.game.assistTargets.push(detected_player_unit);

                                            // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                                            ent.kill();
                                        }
                                    }
                                }

                                for(var i = 0; i < trade_tile_search.length; i++) {
                                    // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                                    var ent = ig.game.spawnEntity(EntityTile_dummy, trade_tile_search[i].pos_x + ig.global.tilesize / 2, trade_tile_search[i].pos_y + ig.global.tilesize / 2);

                                    // For those that returns a unit that are enemies, push that unit to potential attack targets array.
                                    var detected_player_unit = ent.checkEntities();
                                    if(typeof detected_player_unit !== 'undefined' && detected_player_unit.unitType === 'player')
                                        ig.game.tradeTargets.push(detected_player_unit);

                                    // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                                    ent.kill();
                                }

                                // Begin menus ---------------------------------
                                if(ig.game.item_drop === null) {
                                    // At least one enemy is within targetable range, display attack button
                                    if(ig.game.attackTargets.length > 0)
                                        ig.game.spawnEntity(EntityButton_attack, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Attack button

                                    // At least one enemy is within targetable range, display attack button
                                    if(ig.game.assistTargets.length > 0) {
                                        //Spawn heal button only if at least one neighboring unit is not full health
                                        for(var t = 0; t < ig.game.assistTargets.length; t++) {
                                            if(ig.game.assistTargets[t].health < ig.game.assistTargets[t].health_max) {
                                                ig.game.spawnEntity(EntityButton_heal, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Heal button
                                                break;
                                            }
                                        }
                                    }

                                    if(ig.game.tradeTargets.length > 0)
                                        ig.game.spawnEntity(EntityButton_trade, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Trade button

                                    if(ig.game.getTerrain(this.pos.x, this.pos.y).type === 'Armory')
                                        ig.game.spawnEntity(EntityButton_armory, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Armory Button

                                    ig.game.spawnEntity(EntityButton_inventory, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Inventory button

                                    ig.game.spawnEntity(EntityButton_wait, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32); // Wait button
                                }
                                // End menus -----------------------------------
                            }
                        }
                    }
                }
            // Not unit's turn; reset and hold variables to default value
            } else {
                this.idleTimer.reset();
                this.path = null;
                this.currentAnim = this.anims.idle;
            }
        }, // End update method

        unitsTIleSearch: function(attack_distance, attack_area) {
            var unitTiles = [];

            for(var i = 1; i <= attack_area; i++) {
                for(var j = 0; j <= attack_distance + i - 1; j++) {
                    unitTiles.push({
                        pos_x: this.pos.x - (attack_distance - j + i - 1) * ig.global.tilesize,
                        pos_y: this.pos.y - j * ig.global.tilesize,
                        distance: attack_distance - i + 1
                    });

                    if(i !== 0) {
                        unitTiles.push({
                            pos_x: this.pos.x - (attack_distance - j + i - 1) * ig.global.tilesize,
                            pos_y: this.pos.y + j * ig.global.tilesize,
                            distance: attack_distance - i + 1
                        });
                    }
                }
            }

            for(var i = 1; i <= attack_area; i++) {
                for(var j = 1; j <= this.atk_dist + i - 1; j++) {
                    unitTiles.push({
                        pos_x: this.pos.x + (attack_distance - j + i) * ig.global.tilesize,
                        pos_y: this.pos.y - (j - 1) * ig.global.tilesize,
                        distance: attack_distance - i + 1
                    });

                    if(i !== 1) {
                        unitTiles.push({
                            pos_x: this.pos.x + (attack_distance - j + i) * ig.global.tilesize,
                            pos_y: this.pos.y + (j - 1) * ig.global.tilesize,
                            distance: attack_distance - i + 1
                        });
                    }
                }
            }

            return unitTiles;
        },

        levelUpStats: function() {
            if(this.levelUpStatPercentage.mag > Math.random()) this.stat.mag++;
            if(this.levelUpStatPercentage.atk > Math.random()) this.stat.atk++;
            if(this.levelUpStatPercentage.def > Math.random()) this.stat.def++;
            if(this.levelUpStatPercentage.skl > Math.random()) this.stat.skl++;
            if(this.levelUpStatPercentage.res > Math.random()) this.stat.res++;
            if(this.levelUpStatPercentage.spd > Math.random()) this.stat.spd++;
            if(this.levelUpStatPercentage.luk > Math.random()) this.stat.luk++;
        },

        leftClicked: function() {
            if(ig.game.battleState !== 'trading') {
                ig.game.clickedUnit = this;
                ig.game.targetedUnit = this;
            }

            /*if(ig.game.units[ig.game.activeUnit].unitType === 'player' && !this.turnUsed) {
                for(var u = 0; u < ig.game.units.length; u++) {
                    if(ig.game.units[u] === this) {
                        ig.game.activeUnit = u;
                        break;
                    }
                }
            }*/
        },

        check: function(other) {
            this.parent(other);

            if(other instanceof EntityBase_enemy) {
                // Lock the unit in place and prevent unit from sliding due to collision
                this.pos = ig.global.alignToGrid(this.pos.x + ig.global.tilesize / 2, this.pos.y + ig.global.tilesize / 2);
                this.vel = {x: 0, y: 0};

                if(ig.game.units[ig.game.activeUnit] === this)
                    this.destination = null;
            }
        }, // End check method

        draw: function() {
            this.parent();

            // Begin health border/background ----------------------------------
            /*if(this.health < this.health_max && this.hpBarTimer.delta() < 1) {
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        (this.pos.x - ig.game.screen.x) * ig.system.scale,
                        (this.pos.y - ig.game.screen.y - 12) * ig.system.scale,
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
                        (this.pos.y - ig.game.screen.y - 11) * ig.system.scale,
                        ((this.size.x - 2) * (this.health / this.health_max)) * ig.system.scale,
                        3 * ig.system.scale
                    );
                ig.system.context.closePath();
                ig.system.context.fill();
            }*/
            // End health border/background ------------------------------------

            // Begin selectable action tiles -----------------------------------
            if((typeof ig.game.units !== 'undefined' && ig.game.units[ig.game.activeUnit] === this && !this.turnUsed && this.idleTimer.delta() > 0.2) && ig.game.clickedUnit === this) {
                // Available movement tiles
                if(this.mov_curr > 0) {
                    var ctx = ig.system.context;
                    var radius = this.stat.mov + 1;
                    var range = this.atk_dist + this.atk_area - 1;

                    for(var i = 1; i <= range; i++) {
                        for(var j = 0; j <= radius + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                                // Draw upper left quadrant border tiles
                                ctx.fillRect(
                                    this.init_pos.x - (this.stat.mov - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y - j * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower left quadrant border tiles
                                if(j !== 0) {
                                    ctx.fillRect(
                                        this.init_pos.x - (this.stat.mov - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.init_pos.y + j * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }

                    for(var i = 0; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

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

                    for(var i = 1; i <= range; i++) {
                        for(var j = 1; j <= radius + i - 1; j++) {
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

                    for(var i = 1; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

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
                // Available attack tiles
                } else {
                    var ctx = ig.system.context;
                    var radius = ig.game.battleState === 'trade' ? 1 : this.atk_dist;
                    var area = ig.game.battleState === 'trade' ? 1 : this.atk_area;

                    for(var i = 1; i <= area; i++) {
                        for(var j = 0; j <= radius + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = ig.game.attackTargets.length > 0 ? 'rgba(255, 0, 0, 0.25)' : ig.game.assistTargets.length > 0 ? 'rgba(0, 127, 0, 0.25)' : 'rgba(0, 0, 0, 0)';

                                // Draw upper left quadrant border tiles
                                ctx.fillRect(
                                    this.pos.x - (radius - j + i - 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y - j * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower left quadrant border tiles
                                if(j !== 0) {
                                    ctx.fillRect(
                                        this.pos.x - (radius - j + i - 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                        this.pos.y + j * ig.global.tilesize - ig.game.screen.y + 1,
                                        ig.global.tilesize - 2,
                                        ig.global.tilesize - 2
                                    );
                                }
                            ctx.restore();
                        }
                    }

                    for(var i = 1; i <= area; i++) {
                        for(var j = 1; j <= radius + i - 1; j++) {
                            ctx.save();
                                ctx.fillStyle = ig.game.attackTargets.length > 0 ? 'rgba(255, 0, 0, 0.25)' : ig.game.assistTargets.length > 0 ? 'rgba(0, 127, 0, 0.25)' : 'rgba(0, 0, 0, 0)';

                                // Draw upper right quadrant border tiles
                                ctx.fillRect(
                                    this.pos.x + (radius - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );

                                // Draw lower right quadrant border tiles
                                if(j !== 1) {
                                    ctx.fillRect(
                                        this.pos.x + (radius - j + i) * ig.global.tilesize - ig.game.screen.x + 1,
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
        }, // End draw method

        receiveDamage: function(amount, from) {
            // Damage/Recovery amount handling
            if((from instanceof EntityBase_enemy  && amount < 0) || // Prevent enemy units from healing player units
               (from instanceof EntityBase_player && amount > 0))   // Prevent friendly fire (?)
                amount = 0;

            this.parent(amount, from);

            if(this.health < 0)
                this.health = 0;

            if(this.health > this.health_max)
                this.health = this.health_max;

            //this.hpBarTimer.reset();
            console.log(from.name + ' attacks and inflicts ' + amount + ' damage to ' + this.name + '!');
        }, // End receiveDamage method

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        } // End kill method
    });
});
