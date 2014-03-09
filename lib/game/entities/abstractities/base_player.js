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
    'game.entities.misc.tile_dummy'
    //'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_player = ig.Entity.extend({
        unitType: 'player',
        turnUsed: false,

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
        entitiesAvoid: [],

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

        selectedItemIndex: null,
        selectedWeapon: null, // Holds the selected weapon for possible equiping
        equippedWeapon: null, // Might be necessary for future durability checks
        isEquipping: false, // Are we currently inside of the equipping state?
        // End unit equipment and inventory system -----------------------------

        atk_dist: 1, // Attack distance (radius in tiles)

        mov_curr: 0,
        //tile_index: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pointer = ig.game.getEntityByName('pointer');

            this.idleTimer = new ig.Timer();
            this.hpBarTimer = new ig.Timer();

            this.health = this.health_max;
            this.init_pos = this.pos;
            this.mov_curr = this.stat.mov;

            // Load grid movement
            //this.movement = new GridMovement(this);
            //this.movement.speed = {x: this.speed, y: this.speed};

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat.mov * ig.global.tilesize - 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.
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

                                    // Keep these for debug purposes for adding new terrains
                                    //console.log("Tile Index: " + this.tile_index + " (x: " + tile_pos.x + ", y: " + tile_pos.y + ")");
                                    //console.log("Terrain Type: " + ig.game.terrain[this.tile_index].type);
                                    //console.log("Movement Cost: " + ig.game.terrain[this.tile_index].move);
                                    //console.log("Defense Bonus: " + ig.game.terrain[this.tile_index].def);
                                    //console.log("Avoid Bonus: " + ig.game.terrain[this.tile_index].avoid);
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
                                var a = ig.game.units[ig.game.activeUnit];
                                var attack_tile_search = []; // Tiles to search for attacking
                                var assist_tile_search = [
                                    {pos_x: a.pos.x - ig.global.tilesize, pos_y: a.pos.y},
                                    {pos_x: a.pos.x, pos_y: a.pos.y - ig.global.tilesize},
                                    {pos_x: a.pos.x, pos_y: a.pos.y + ig.global.tilesize},
                                    {pos_x: a.pos.x + ig.global.tilesize, pos_y: a.pos.y}
                                ]; // Tiles to search for assisting
                                var radius = a.atk_dist + 1;

                                for(var i = 0; i < radius; i++) {
                                    attack_tile_search.push({pos_x: a.pos.x - (a.atk_dist - i) * ig.global.tilesize, pos_y: a.pos.y - i * ig.global.tilesize});

                                    if(i !== 0)
                                        attack_tile_search.push({pos_x: a.pos.x - (a.atk_dist - i) * ig.global.tilesize, pos_y: a.pos.y + i * ig.global.tilesize});
                                }

                                for(var i = 1; i < radius; i++) {
                                    attack_tile_search.push({pos_x: a.pos.x + (radius - i) * ig.global.tilesize, pos_y: a.pos.y - (i - 1) * ig.global.tilesize});

                                    if(i !== 1)
                                        attack_tile_search.push({pos_x: a.pos.x + (radius - i) * ig.global.tilesize, pos_y: a.pos.y + (i - 1) * ig.global.tilesize});
                                }

                                for(var i = 0; i < attack_tile_search.length; i++) {
                                    // Spawn dummy tile entities at nearby tiles and run each of their checkEntities() methods.
                                    var ent = ig.game.spawnEntity(EntityTile_dummy, attack_tile_search[i].pos_x + ig.global.tilesize / 2, attack_tile_search[i].pos_y + ig.global.tilesize / 2);

                                    // For those that returns a unit that are enemies, push that unit to potential attack targets array.
                                    var detected_enemy_unit = ent.checkEntities();
                                    if(typeof detected_enemy_unit !== 'undefined' && detected_enemy_unit.unitType === 'enemy')
                                        ig.game.attackTargets.push(detected_enemy_unit);

                                    // Kill dummy tile entities immediately afterwards; we don't need them anymore.
                                    ent.kill();
                                }

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

                                // At least one enemy is within targetable range, display attack button
                                if(ig.game.attackTargets.length > 0) {
                                    // Begin Attack Button ---------------------
                                    ig.game.spawnEntity(Button, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32, {
                                        name: 'btn_attack',
                                        text: ['Attack'],

                                        pressedUp: function() {
                                            // Override default cursor property to force snap to grid (assist user in selecting tiles)
                                            a.pointer.forceSnapToGrid = true;

                                            // All combat preparations are set; signal main game to wait for user to select target
                                            ig.game.battleAnimStage = 'attack';
                                        }
                                    });
                                    // End Attack Button -----------------------
                                }

                                // At least one enemy is within targetable range, display attack button
                                if(ig.game.assistTargets.length > 0) {
                                    // Begin Assist Button ---------------------
                                    ig.game.spawnEntity(Button, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32, {
                                        name: 'btn_assist',
                                        text: ['Assist'],

                                        pressedUp: function() {
                                            // Override default cursor property to force snap to grid (assist user in selecting tiles)
                                            a.pointer.forceSnapToGrid = true;

                                            // All combat preparations are set; signal main game to wait for user to select target
                                            ig.game.battleAnimStage = 'assist';
                                        }
                                    });
                                    // End Assist Button -----------------------

                                    // Begin Trade Button ----------------------
                                    ig.game.spawnEntity(Button, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32, {
                                        name: 'btn_trade',
                                        text: ['Trade'],

                                        pressedUp: function() {
                                            // Override default cursor property to force snap to grid (assist user in selecting tiles)
                                            a.pointer.forceSnapToGrid = true;

                                            // All combat preparations are set; signal main game to wait for user to select target
                                            ig.game.battleAnimStage = 'trade';
                                        }
                                    });
                                    // End Trade Button ------------------------
                                }

                                // Begin item button ---------------------------
                                ig.game.spawnEntity(Button, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32, {
                                    name: 'btn_itemMenu',
                                    text: ['Items'],

                                    // Item menu button pressedUp()
                                    pressedUp: function() {
                                        // Kill all first tier buttons
                                        ig.global.killAllButtons(Button);

                                        // Check if item button #0 exists. If not spawn them, else do nothing.
                                        if(typeof ig.game.getEntityByName('btn_item_0') === 'undefined') {
                                            console.log('Spawning item buttons');

                                            // Spawn the items
                                            for(var i = 0; i < ig.game.units[ig.game.activeUnit].item.length; i++) {
                                                //console.log(ig.game.units[ig.game.activeUnit].item[i]);
                                                //console.log(ig.game.units[ig.game.activeUnit].item.length);

                                                ig.game.spawnEntity(Button, ig.game.screen.x + 128, ig.game.screen.y + (i + 1) * 32, {
                                                    name: 'btn_item_' + i,
                                                    index: i,
                                                    text: [ig.game.units[ig.game.activeUnit].item[i] !== null ? ig.game.units[ig.game.activeUnit].item[i].name : ''],

                                                    // Item button pressedUp()
                                                    pressedUp: function() {
                                                        // Determine which item is being selected.
                                                        ig.game.units[ig.game.activeUnit].selectedItemIndex = this.index;
                                                        //console.log(ig.game.units[ig.game.activeUnit].selectedItemIndex);

                                                        // Make the item clicked the weapon for possible equipment
                                                        ig.game.units[ig.game.activeUnit].selectedWeapon = ig.game.units[ig.game.activeUnit].item[this.index];
                                                        ig.game.units[ig.game.activeUnit].isEquipping = true;
                                                        console.log(ig.game.units[ig.game.activeUnit].selectedWeapon);

                                                        // The selected item was not in unit's inventory slot 0, move item to slot 0 and equip the item
                                                        if(ig.game.units[ig.game.activeUnit].selectedItemIndex !== 0) {
                                                            // Check if equip button exists. If not spawn it, else do nothing.
                                                            if(typeof ig.game.getEntityByName('btn_equip') === 'undefined') {
                                                                // Spawn the Equip button.
                                                                ig.game.spawnEntity(Button, ig.game.screen.x + 224, ig.game.screen.y + 32, {
                                                                    name: 'btn_equip',
                                                                    text: ['Equip'],

                                                                    // Equip button pressedUp()
                                                                    pressedUp: function() {
                                                                        // Swap the item positions to put the selected item into the first position
                                                                        ig.game.units[ig.game.activeUnit].item = ig.game.swapItems(ig.game.units[ig.game.activeUnit].item, 0, ig.game.units[ig.game.activeUnit].selectedItemIndex);
                                                                        ig.game.units[ig.game.activeUnit].mod = ig.game.clearMod();
                                                                        ig.game.units[ig.game.activeUnit].derived_stats = ig.game.recomputeStats(ig.game.units[ig.game.activeUnit]);

                                                                        ig.game.units[ig.game.activeUnit].selectedItemIndex = null;
                                                                        ig.game.units[ig.game.activeUnit].selectedWeapon = null;
                                                                        ig.game.units[ig.game.activeUnit].isEquipping = false;

                                                                        // Kill all second and third tier buttons
                                                                        ig.global.killAllButtons(Button);

                                                                        // Respawn first tier buttons
                                                                        ig.game.menuVisible = false;
                                                                    } // End equip button pressedUp()
                                                                });
                                                            }
                                                        // The selected item was in the unit's inventory slot 0 (equipped slot), unequip the item
                                                        } else {
                                                            // Check if equip button exists. If not spawn it, else do nothing.
                                                            if(typeof ig.game.getEntityByName('btn_unequip') === 'undefined') {
                                                                // Spawn the Equip button.
                                                                ig.game.spawnEntity(Button, ig.game.screen.x + 224, ig.game.screen.y + ++menuButtonIndex * 32, {
                                                                    name: 'btn_unequip',
                                                                    text: ['Unequip'],

                                                                    // Equip button pressedUp()
                                                                    pressedUp: function() {
                                                                        // Clear and recompute the modifiers applied through weapons
                                                                        ig.game.units[ig.game.activeUnit].mod = ig.game.clearMod();
                                                                        ig.game.units[ig.game.activeUnit].derived_stats = ig.game.recomputeStats(ig.game.units[ig.game.activeUnit]);
                                                                        console.log(ig.game.units[ig.game.activeUnit].derived_stats);

                                                                        ig.game.units[ig.game.activeUnit].selectedItemIndex = null;
                                                                        ig.game.units[ig.game.activeUnit].selectedWeapon = null;
                                                                        ig.game.units[ig.game.activeUnit].isEquipping = false;

                                                                        // Kill all second and third tier buttons
                                                                        ig.global.killAllButtons(Button);

                                                                        // Respawn first tier buttons
                                                                        ig.game.menuVisible = false;
                                                                    } // End equip button pressedUp()
                                                                });
                                                            }
                                                        }
                                                    } // End item button pressedUp()
                                                });
                                            }
                                        }
                                    } // End item menu button pressedUp()
                                });
                                // End item button -----------------------------

                                // Begin wait button ---------------------------
                                ig.game.spawnEntity(Button, ig.game.screen.x + 32, ig.game.screen.y + ++menuButtonIndex * 32, {
                                    name: 'btn_wait',
                                    text: ['Wait'],

                                    pressedUp: function() {
                                        ig.game.units[ig.game.activeUnit].turnUsed = true;
                                        ig.game.menuVisible = false;
                                    }
                                });
                                // End wait button -----------------------------
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
            ig.game.clickedUnit = ig.game.targetedUnit = this;
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
            if(this.health < this.health_max && this.hpBarTimer.delta() < 1) {
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
            }
            // End health border/background ------------------------------------

            // Begin selectable action tiles -----------------------------------
            if((typeof ig.game.units !== 'undefined' && ig.game.units[ig.game.activeUnit] === this && !this.turnUsed && this.idleTimer.delta() > 0.2) && ig.game.clickedUnit === this) {
                // Available movement tiles
                if(this.mov_curr > 0) {
                    var ctx = ig.system.context;
                    var radius = this.stat.mov + 1;

                    for(var i = 0; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

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

                    for(var i = 1; i <= radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                            // Draw upper right quadrant border tiles
                            ctx.fillRect(
                                this.init_pos.x + (radius - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower right quadrant border tiles
                            if(i !== 1) {
                                ctx.fillRect(
                                    this.init_pos.x + (radius - i + 1) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        ctx.restore();

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
                    var radius = this.atk_dist + 1;

                    for(var i = 0; i < radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                            // Draw upper left quadrant border tiles
                            ctx.fillRect(
                                this.pos.x - (this.atk_dist - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y - i * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower left quadrant border tiles
                            if(i !== 0) {
                                ctx.fillRect(
                                    this.pos.x - (this.atk_dist - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y + i * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        ctx.restore();
                    }

                    for(var i = 1; i < radius; i++) {
                        ctx.save();
                            ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                            // Draw upper right quadrant border tiles
                            ctx.fillRect(
                                this.pos.x + (radius - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower right quadrant border tiles
                            if(i !== 1) {
                                ctx.fillRect(
                                    this.pos.x + (radius - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        ctx.restore();
                    }
                }
            }
            // End available movement tiles ------------------------------------
        }, // End draw method

        receiveDamage: function(amount, from) {
            // Damage/Recovery amount handling
            if((from instanceof EntityBase_enemy  && amount < 0) || // Prevent enemy units from healing player units
               (from instanceof EntityBase_player && amount > 0))   // Prevent friendly fire (?)
                amount = 0;

            this.parent(amount, from);
            this.hpBarTimer.reset();
            console.log(this.name + ' attacks and inflicts ' + amount + ' damage to ' + from.name + '!');
        }, // End receiveDamage method

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        } // End kill method
    });
});
