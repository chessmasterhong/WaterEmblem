/**
 *  main.js
 *  -----
 *  Contains the core logic for the game.
 */


//##############################################################################
//# Global variables                                                           #
//##############################################################################
ig.global.main_player_name = 'Main Player';
ig.global.game_pos = {map: null, x: null, y: null};
ig.global.encounter = {zone: 0, spawn_min: 2, spawn_max: 4};
ig.global.tilesize = 32;


//##############################################################################
//# The game                                                                   #
//##############################################################################
ig.module(
    'game.main'
)
.requires(
    // ImpactJS Core
    'impact.game',
    'impact.font',
    'impact.debug.debug', // <-- DEVELOPMENT DEBUG ONLY

    // PC and NPC grid sprites
    'game.entities.players.advancedHero',
    'game.entities.players.arch_sage',
    'game.entities.players.archer',
    'game.entities.players.cavalier',
    'game.entities.players.dark_druid',
    'game.entities.players.female_mage',
    'game.entities.players.female_sage',
    'game.entities.players.fighter',
    'game.entities.players.general',
    'game.entities.players.hero', // Main character
    'game.entities.players.knight',
    'game.entities.players.knight_lord',
    'game.entities.players.lord',
    'game.entities.players.mercenary',
    'game.entities.players.monk',
    'game.entities.players.myridon',
    'game.entities.players.paladin',
    'game.entities.players.pegasus_knight',
    'game.entities.players.pirate',
    'game.entities.players.sniper',
    'game.entities.players.sword_master',
    'game.entities.players.thief',
    'game.entities.players.troubadour',
    'game.entities.players.valkyrie',
    'game.entities.players.warrior',
    'game.entities.players.wyvern_knight',
    'game.entities.players.wyvern_lord',

    // PC and NPC battle animations
    'game.entities.animations.hero_battleanim', // Main character
    'game.entities.animations.enemy_assassin_battleanim',

    // Generators and Objects
    'game.entities.misc.enemy_spawner', // Random enemy spawner entity
    'game.entities.misc.pointer', // Mouse cursor entity

    // Overlays
    'game.entities.misc.battle_anim_overlay', // Battle animation overlay

    // Levels/Maps
    'game.levels.demo',
    'game.levels.battlefield',

    // Item catalog
    'game.items.catalog',

    // Plugins
    'plugins.astar.astar-for-entities', // A* search algorithm for pathfinding
    //'plugins.astar.astar-for-entities-debug', // <-- DEVELOPMENT DEBUG ONLY
    'plugins.button.button', // Button functionality
    'plugins.camera.camera', // Game screen camera
    'plugins.director.director', // Level transition abstraction
    'plugins.font-sugar.font', // Font customization
    'plugins.screen-fader.screen-fader' // Screen fade transition effect
)
.defines(function() {
    // Enable ECMAScript 5 (JavaScript 1.8.5) Strict Mode
    //   http://developer.mozilla.org/en/JavaScript/Strict_mode
    //   http://impactjs.com/blog/2012/05/impact-1-20
    "use strict";

    /**
     *  ig.BaseGame
     *  -----
     *  Contains the shared properties and actions from which the core game
     *  states are derived from.
     */
    ig.BaseGame = ig.Game.extend({
        font: new ig.Font('media/arial.font_14.png', {
            fontColor: '#ECEEA1',
            borderColor: '#000000',
            borderSize: 1,
            letterSpacing: -1
        }),

        statScreen: new ig.Image('media/gui/statscreen.png'),
        //battleAnimScreen: new ig.Image('media/gui/battle_screen.png'),
        hpModal: new ig.Image('media/gui/hpbarmodal.png'),
        terrainModal: new ig.Image('media/gui/terrainModal.png'),

        init: function() {
            // Bind keys to game actions

            // Mouse buttons
            ig.input.bind(ig.KEY.MOUSE1,      'leftClick' ); // Left Mouse Button: select option, interact with object/character, continue dialogue, etc.
            ig.input.bind(ig.KEY.MOUSE2,      'rightClick'); // Right Mouse Button: Display the game menu

            // Directional movement and menu navigation
            ig.input.bind(ig.KEY.UP_ARROW,    'up'    ); // Up Arrow: move player or navigation up
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down'  ); // Down Arrow: move player or nagivation down
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left'  ); // Left Arrow: move player or navigation left
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right' ); // Right Arrow: move player or navigation right
            ig.input.bind(ig.KEY.W,           'up'    ); // W: move player or navigation up
            ig.input.bind(ig.KEY.S,           'down'  ); // S: move player or navigation down
            ig.input.bind(ig.KEY.A,           'left'  ); // A: move player or navigation left
            ig.input.bind(ig.KEY.D,           'right' ); // D: move player or navigation right
            ig.input.bind(ig.KEY.C,           'camera'); // C: toggles camera to focus and follow cursor or active player
            ig.input.bind(ig.KEY.ESC,         'escape'); // Escape: cancel option/selection, undo, etc.
            ig.input.bind(ig.KEY.ENTER,       'menu'  ); // Enter: Opens up a "menu" on click. Only Temporary for testing.

            // Modifier keys
            //ig.input.bind(ig.KEY.SHIFT,       'SHIFT' ); // Left/Right Shift
            //ig.input.bind(ig.KEY.CTRL ,       'CTRL' ); // Left/Right Control
        } // End init method
    }); // End ig.BaseGame

    /**
     *  ig.MainGame
     *  -----
     *  Displays the main game screen with a top-down perspective centered on the
     *  player. The player is allowed to navigate and interact in the game using
     *  a 4-directional "grid-like" movement system.
     */
    /*ig.MainGame = ig.BaseGame.extend({
        player: null,
        levelVars: [LevelDemo],
        baseMenu: new ig.Image('media/gui/menu.png'),

        init: function() {
            this.parent();

            // Load appropriate map
            this.director = new ig.Director(this, this.levelVars);
            if(ig.global.game_pos.map !== null)
                this.director.loadLevel(ig.global.game_pos.map);
            else
                this.director.firstLevel();

            this.spawnEntity(EntityPointer, 0, 0);

            // Move player to last world position (if exists)
            if(ig.global.game_pos.x !== null && ig.global.game_pos.y !== null)
                this.player = this.spawnEntity(EntityHero, ig.global.game_pos.x, ig.global.game_pos.y);
            else
                this.player = this.spawnEntity(EntityHero, 128, 128);

            this.screenFadeOut = new ig.ScreenFader({
                fade: 'out',
                speed: 4,
                //delayAfter: 1,
            });
        }, // End init method

        update: function() {
            this.parent();

            // Make screen follow player
            this.player && (this.screen.x = this.player.pos.x - ig.system.width  * 0.5,
                            this.screen.y = this.player.pos.y - ig.system.height * 0.5);
        }, // End update method

        draw: function() {
            this.parent();

            if(this.screenFadeOut)
                this.screenFadeOut.draw();
        }, // End draw method
    }); // End ig.MainGame
    */

    /**
     * ig.BattleMode
     * -----
     * Displays the battlefield with a top-down persoective centered on the
     * current active unit. The player's party, enemy's party/units, and
     * assistive or neutral party/units take turns on the battlefield.
     *
     * The player leaves battle mode and back onto the main game under the
     * condition where either:
     *   1. All or specific enemies are defeated.
     *   2. Every member in the player's party is defeated.
     *   3. Some special condition is triggered (i.e., after a certain number of
     *      turns has elapsed, or the health of a specific unit reached below a
     *      certain amount, etc.).
     */
    ig.BattleMode = ig.BaseGame.extend({
        // Mouse pointer properties
        pointer: null, // Pointer entity
        clickedUnit: null, // Unit the cursor clicked (selected)
        hoveredUnit: null, // Unit the cursor is hovered over
        hoveredTerrain: null, // Index of terrain the cursor is hovered over

        // Camera properties
        camera: null, // Camera plugin
        freeCamera: false, // Cursor-focus/Unit-focus camera toggle
        screenshaker: false,

        // Battlefield properties
        battleAnimStage: null, // null: default
                               // 'attack': selecting enemy unit to attack
                               // 'battle_prepare': in battle animation, preparing units
                               // 'battle_start': in battle animation, running battle sequence
                               // 'assist': selecting friendly unit to assist/trade
        mapsize: null, // Full map size in pixels
        end_battle: false, // End battle flag (when map objectives are satisfied)
        units: [], // All units participating on battlefield
        activeUnit: 0, // Controlling unit
        partyMembers: 2, // Members in player's party (not including main player)
        targets: [], // All units possible to be targeted
        targetedUnit: null, // Unit targeted on receiving end of action
        attackQueue: [], // Active unit and target unit attack queue

        // Field terrains via tile index number
        //   http://impactjs.com/forums/help/get-tile-index-number-from-main-layer-tileset/page/1
        terrain: {
            1: {type: 'Plain',    move: 1, def: 0, avoid: 0             },
            2: {type: 'Fortress', move: 1, def: 2, avoid: 20, hp_rec: 10},
            3: {type: 'Forest',   move: 2, def: 1, avoid: 20            },
            4: {type: 'Mountain', move: 3, def: 1, avoid: 40            },
            5: {type: 'Sand',     move: 2, def: 0, avoid: 10            }
        },

        // Maps
        //levelVars: [LevelBattlefield],

        init: function() {
            this.parent();

            // Set up camera
            this.camera = new Camera(ig.system.width / 3, ig.system.height / 3, 5);
            this.camera.trap.size = {x: ig.system.width / 4, y: ig.system.height / 3};

            // Set up new item catalog
            this.itemCatalog = new ItemCatalog();

            // Load map
            this.loadLevel(LevelBattlefield);

            // Set up cursor
            this.pointer = this.spawnEntity(EntityPointer, 0, 0);

            // Initialize timers
            this.atkAnimTimer = new ig.Timer();

            this.screenFadeOut = new ig.ScreenFader({
                fade: 'out',
                speed: 4,
                //delayAfter: 1,
            });

            console.log('Player position stored at: (map: ' + ig.global.game_pos.map + ', x: ' + ig.global.game_pos.x + ', y: ' + ig.global.game_pos.y + ')');
            console.log('Enter battle mode!');

            // Determine position range on battlefield to spawn enemy
            this.mapsize = {x: this.collisionMap.width * ig.global.tilesize, y: this.collisionMap.height * ig.global.tilesize};

            // Generate, spawn enemies, and add enemies to total units in this battle
            var enemy_spawner = this.getEntityByName('enemy_spawner');
            this.units = enemy_spawner.spawnEnemies(enemy_spawner.generateEnemies(ig.global.encounter.spawn_min, ig.global.encounter.spawn_max));

            // Spawn player's party on battlefield
            var party = [];
            var mid = parseInt(this.partyMembers/2);

            // Spawn party leader (main character)
            party[0] = this.spawnEntity(
                EntityHero,
                Math.floor(this.mapsize.x * 0.75 / ig.global.tilesize) * ig.global.tilesize,
                Math.floor(this.mapsize.y * 0.5  / ig.global.tilesize) * ig.global.tilesize,
                {name: ig.global.main_player_name}
            );

            // Create an array of entities here for random spawning of entities.
            var party_members = [EntityFemale_mage];
            // Spawn party members (non-main character)
            for(var p = 1; p <= this.partyMembers; p++) {
                party[p] = this.spawnEntity(
                    // Select a random unit from the array party_members and spawn
                    party_members[Math.floor(Math.random() * party_members.length)],
                    Math.floor(this.mapsize.x * 0.8 / ig.global.tilesize) * ig.global.tilesize,
                    Math.floor(this.mapsize.y / (this.partyMembers + 1) * p / ig.global.tilesize) * ig.global.tilesize
                    //{name: 'player_' + p}
                );
            }

            // Add player and friendlies to total units in this battle
            this.units = this.units.concat(party);

            // Sort unit order by descending/reverse alphabetical order (order: player units -> enemy units -> ally units)
            this.units.sort(
                function(unit_0, unit_1) {
                    return unit_0.unitType === unit_1.unitType ? 0 : unit_0.unitType < unit_1.unitType ? 1 : -1;
                }
            );
            //console.log(this.units);

            console.log('Unit order sorted:')
            for(var e = 0; e < this.units.length; e++) {
                console.log(e + ' --> ' + this.units[e].name);
            }

            this.clickedUnit = this.targetedUnit = this.units[0];

            console.log('========== BEGIN BATTLE SEQUENCE ==========');

            console.log('Active Unit: ' + this.activeUnit + ' (' + this.units[0].name + ')');
        }, // End init method

        update: function() {
            this.parent();

            // Handle unit movement order
            if(this.units[this.activeUnit].turnUsed) {
                this.activeUnit = (this.activeUnit + 1) % this.units.length;

                // Clean buttons
                ig.global.killAllButtons(Button);
                this.menuVisible = false;

                // Auto-select next active player unit
                if(this.units[this.activeUnit].unitType === 'player')
                    this.clickedUnit = this.targetedUnit = this.units[this.activeUnit];
                else {
                    this.clickedUnit = this.targetedUnit = null;
                    this.targets = [];
                }

                // DEBUG: used to check if activeUnit moved to next unit
                console.log('Active Unit: ' + this.activeUnit + ' (' + this.units[this.activeUnit].name + ')');

                // Check how many units have moved for this turn
                var units_moved = 0;
                for(var u = 0; u < this.units.length; u++) {
                    if(this.units[this.activeUnit].turnUsed)
                        units_moved++;
                }

                // If all units have moved for this turn, set all alive units to be able to move again
                if(units_moved === this.units.length) {
                    for(var u = 0; u < this.units.length; u++) {
                        //console.log(this.units[u].name + ' --> ' + this.units[u].turnUsed);
                        if(!this.units[u]._killed) {
                            this.units[u].turnUsed = false;
                            this.units[u].mov_curr = this.units[u].stat.mov;
                        }
                    }
                }

                // Check if there are any enemy units remaining on the battlefield
                var enemy_count = 0;
                var main_player_alive = false;
                for(var u = 0; u < this.units.length; u++) {
                    if(this.units[u].unitType === 'enemy') {
                        enemy_count++;
                        if(this.units[u]._killed)
                            enemy_count--;
                    } else if(this.units[u].name === ig.global.main_player_name && !this.units[u]._killed)
                        main_player_alive = true;
                }

                // If game cannot find main character (main player is defeated), enter game over state
                if(!main_player_alive)
                    ig.system.setGame(ig.GameOver);
            }

            // Game sub-selection states
            if(this.battleAnimStage === 'attack' && this.units[this.activeUnit] !== this.targetedUnit) {
                // Player unit initiates the action
                if(this.units[this.activeUnit].unitType === 'player') {
                    // Target is an enemy unit
                    if(this.targetedUnit.unitType === 'enemy') {
                        // Find unit from list of available targets
                        for(var t = 0; t < this.targets.length; t++) {
                            if(this.targetedUnit === this.targets[t])
                                this.battleAnimStage = 'battle_prepare';
                        }
                    }
                // Enemy unit initiates the action
                } else if(this.units[this.activeUnit].unitType === 'enemy') {
                    // Target is a player unit
                    if(this.targetedUnit.unitType === 'player')
                        this.battleAnimStage = 'battle_prepare';
                    else {
                        this.attackQueue = []; // Reset attack queue
                        this.battleAnimStage = null; // End battle animation (stop displaying screen text)
                        this.units[this.activeUnit].turnUsed = true; // End active unit's turn
                    }
                }

                console.log(this.units[this.activeUnit].name + ' unit is standing on terrain: ' + this.getTerrain(this.units[this.activeUnit].pos.x, this.units[this.activeUnit].pos.y).type);
                console.log(this.targetedUnit.name + ' unit is standing on terrain: ' + this.getTerrain(this.targetedUnit.pos.x, this.targetedUnit.pos.y).type);
            } else if(this.battleAnimStage === 'battle_start') {
                // Initiate battle animation sequence

                // Initial attack ----------------------------------------------
                // Start battle sequence after some defined time
                // Active unit has not played their attack animation yet
                if(this.atkAnimTimer.delta() > 1 && this.attackQueue[0].currentAnim === this.attackQueue[0].anims.idle) {
                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack0;
                    this.attackQueue[0].currentAnim.rewind();
                // Active unit is playing their attack animation and is on animation frame just before striking
                } else if(this.attackQueue[0].currentAnim.loopCount >= 1 && this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0) {
                    this.screenshaker = true;
                    this.targetedUnit.receiveDamage(this.units[this.activeUnit].stat.atk - this.targetedUnit.stat.def); // Inflict damage
                    console.log(this.units[this.activeUnit].name + ' attacks and inflicts ' + (this.units[this.activeUnit].stat.atk - this.targetedUnit.stat.def) + ' damage to ' + this.targetedUnit.name + '!');
                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack1;
                    this.attackQueue[0].currentAnim.rewind();
                // Counterattack -----------------------------------------------
                // Active unit has finished playing their attack animation and target unit has not played their attack animation yet
                } else if(this.targetedUnit.health > 0 && this.attackQueue[0].currentAnim.loopCount >= 1 && this.attackQueue[1].currentAnim === this.attackQueue[1].anims.idle) {
                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack0;
                    this.attackQueue[1].currentAnim.rewind();
                // Target unit is playing their attack animation and is on animation frame just before striking
                } else if(this.targetedUnit.health > 0 && this.attackQueue[1].currentAnim.loopCount >= 1 && this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0) {
                    this.screenshaker = true;
                    this.units[this.activeUnit].receiveDamage(this.targetedUnit.stat.atk - this.units[this.activeUnit].stat.def); // Inflict damage
                    console.log(this.targetedUnit.name + ' attacks and inflicts ' + (this.targetedUnit.stat.atk - this.units[this.activeUnit].stat.def) + ' damage to ' + this.units[this.activeUnit].name + '!');
                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack1;
                    this.attackQueue[1].currentAnim.rewind();
                // Target unit has finished playing their attack animation
                } else if(this.attackQueue[1].currentAnim.loopCount >= 1 || this.targetedUnit.health <= 0) {
                    // Second attack -------------------------------------------
                    // There is another unit in the attack queue
                    if(this.attackQueue.length >= 3 && this.units[this.activeUnit].health > 0 && this.targetedUnit.health > 0) {
                        // Faster unit (unit with greater spd stat) has not played their attack animation yet
                        if(this.attackQueue[2].currentAnim === this.attackQueue[2].anims.idle) {
                            this.attackQueue[2].currentAnim = this.attackQueue[2].anims.attack0;
                            this.attackQueue[2].currentAnim.rewind();
                        // Faster unit is playing their attack animation and is on animation frame just befor striking
                        } else if(this.attackQueue[2].currentAnim.loopCount >= 1 && this.attackQueue[2].currentAnim === this.attackQueue[2].anims.attack0) {
                            this.screenshaker = true;
                            if(this.units[this.activeUnit].stat.spd > this.targetedUnit.stat.spd) {
                                this.targetedUnit.receiveDamage(this.units[this.activeUnit].stat.atk - this.targetedUnit.stat.def); // Inflict damage
                                console.log(this.units[this.activeUnit].name + ' attacks and inflicts ' + (this.units[this.activeUnit].stat.atk - this.targetedUnit.stat.def) + ' damage to ' + this.targetedUnit.name + '!');
                            } else {
                                this.units[this.activeUnit].receiveDamage(this.targetedUnit.stat.atk - this.units[this.activeUnit].stat.def); // Inflict damage
                                console.log(this.targetedUnit.name + ' attacks and inflicts ' + (this.targetedUnit.stat.atk - this.units[this.activeUnit].stat.def) + ' damage to ' + this.units[this.activeUnit].name + '!');
                            }
                            this.attackQueue[2].currentAnim = this.attackQueue[2].anims.attack1;
                            this.attackQueue[2].currentAnim.rewind();
                        }
                    // Clean up and end battle animation -----------------------
                    } else if(this.attackQueue.length === 2 || this.attackQueue[2].currentAnim.loopCount >= 1) {
                        this.getEntityByName('battle_anim_overlay').kill(); // Kill overlay entity
                        this.attackQueue[0].kill(); // Kill unit animation entity
                        this.attackQueue[1].kill();  // Kill unit animation entity
                        if(this.attackQueue.length === 3)
                            this.attackQueue[2].kill();  // Kill unit animation entity
                        this.attackQueue = []; // Reset attack queue
                        this.battleAnimStage = null; // End battle animation (stop displaying screen text)
                        this.units[this.activeUnit].turnUsed = true; // End active unit's turn
                    }
                }
            }

            // Menu escape and clicked unit deselection during player's turn
            if(ig.input.pressed('escape') || this.units[this.activeUnit].unitType !== 'player') {
                if(this.clickedUnit !== null && this.clickedUnit.unitType === 'player' && this.clickedUnit.vel.x === 0 && this.clickedUnit.vel.y === 0) {
                    if(this.clickedUnit.pos !== this.clickedUnit.init_pos) {
                        // User wants to undo/cancel the unit movement
                        this.clickedUnit = this.targetedUnit = this.units[this.activeUnit];
                        this.clickedUnit.pos = this.clickedUnit.init_pos;
                        this.clickedUnit.mov_curr = this.clickedUnit.stat.mov;
                        this.clickedUnit.currentAnim = this.clickedUnit.anims.idle;
                    } else {
                        this.clickedUnit = this.targetedUnit = null;
                        this.targets = [];
                    }
                    this.battleAnimStage = null;
                }

                // Clear buttons
                ig.global.killAllButtons(Button);
                this.menuVisible = false;
            }

            // Menu to prematurely end player's phase (end all player's unit turn)
            if(ig.input.state('rightClick') && !this.menuVisible && this.units[this.activeUnit].unitType === 'player' && this.units[this.activeUnit].vel.x === 0 && this.units[this.activeUnit].vel.y === 0) {
                this.menuVisible = true;

                this.spawnEntity(Button, ig.input.mouse.x + this.screen.x, ig.input.mouse.y + this.screen.y, {
                    name: 'btn_endTurn',
                    font: new ig.Font('media/arial.font_14.png'),
                    text: ['End Turn'],
                    textPos: {x: 37, y: 8},
                    textAlign: ig.Font.ALIGN.CENTER,
                    size: {x: 75, y: 23},
                    animSheet: new ig.AnimationSheet('media/gui/button.png', 75, 23),

                    pressedDown: function() {
                        // Set all player's units turn to used
                        for(var u = 0; u < ig.game.units.length; u++) {
                            if(ig.game.units[u].unitType === 'player') {
                                ig.game.units[u].turnUsed = true;
                                ig.game.activeUnit = (ig.game.activeUnit + 1) % ig.game.units.length;
                            }
                        }

                        ig.game.menuVisible = false;
                        this.kill();
                    }
                });
            }

            this.camera.max = {
                x: this.collisionMap.width * ig.global.tilesize - ig.system.width,
                y: this.collisionMap.height * ig.global.tilesize - ig.system.height
            };

            // Prevent camera from panning off of battle animation overlay
            // Disable camera toggle while in battle animation
            if(this.battleAnimStage !== 'battle_start') {
                // Toggle camera mode
                if(ig.input.pressed('camera') && this.freeCamera) {
                    this.freeCamera = false;
                    console.log('Camera: Focused on active unit');
                } else if(ig.input.pressed('camera') && !this.freeCamera) {
                    this.freeCamera = true;
                    console.log('Camera: Focused on mouse cursor');
                }

                // Make screen follow mouse cursor
                if(this.freeCamera) {
                    this.camera.follow(this.pointer);
                // Make screen follow active unit
                } else {
                    var unitFocus = this.units[this.activeUnit];
                    if(!this.units[this.activeUnit]._killed)
                        this.camera.follow(unitFocus);
                }
            }

            // End battle conditions
            if(!this.end_battle && typeof unitFocus !== 'undefined' && unitFocus.unitType === 'player' && enemy_count === 0) {
                console.log('Leaving battle mode.');
                this.fadeIn();
                this.end_battle = true;
            // Stop player's movement, wait for fade transition to finish, and leave battlefield
            } else if(this.end_battle) {
                unitFocus.pos = ig.global.alignToGrid(unitFocus.pos.x, unitFocus.pos.y);
                unitFocus.vel = {x: 0, y: 0};
            }
        }, // End update method

        // Create fade effect to transition from game screen to battlefield
        fadeIn: function() {
            this.screenFadeIn = new ig.ScreenFader({
                fade: 'in',
                speed: 4,
                callback: function() { ig.system.setGame(ig.MainGame); },
                delayBefore: 1,
                delayAfter: 1
            });
        }, // End fadeIn method

        // Method for equpping/reordering items
        swapItems: function(array, a, b) {
            var temp = array[a];
            array[a] = array[b];
            array[b] = temp;
            console.log('Swapping Items');
            return array;
        }, // End swapItems method

        // Method for trading items between two different players.
        tradeItems: function(array_a, array_b, index_a, index_b){
            // Store the item Player A wants to trade Player B.
            var selectedItemToTrade = array_a[index_a];
            // Store the item Player A wants from Player B.
            var selectedItemForTrade = array_b[index_b];
            // Move selected item from player A index to player B index
            array_b[index_b] = selectedItemToTrade;
            // Now move the item from Player B's inventory into Player A's inventory
            array_a[index_a] = selectedItemForTrade;
        }, // End tradeItems method

        /**
         *  object getTerrain(number pos_x, number pos_y)
         *  -----
         *  Gets the terrain object data at the specified location.
         */
        getTerrain: function(pos_x, pos_y) {
            var tile_pos = {
                x: Math.floor((pos_x + ig.global.tilesize / 2) / ig.global.tilesize),
                y: Math.floor((pos_y + ig.global.tilesize / 2) / ig.global.tilesize)
            };
            return this.terrain[this.backgroundMaps[1].data[tile_pos.y][tile_pos.x]];
        },

        /**
         *  int this.sgn(number num)
         *  -----
         *  Sign function or signum function. Extracts the sign of a real number.
         *
         *  Precondition:
         *      num: A real number.
         *
         *  Postcondition:
         *      Returns the sign of the number.
         *
         *  Example:
         *      sgn(3.5) // 1
         *      sgn(-8)  // -1
         *      sgn(0)   // 0
         */
        sgn: function(num) {
            return (num > 0) - (num < 0);
        },

        draw: function() {
            if(!this.screenshaker)
                this.parent();
            else {
                // Modified screen shaking effect (no plugins)
                //   http://impactjs.com/forums/code/plugin-to-shake-the-screen/page/1
                ig.system.context.save();
                    // Screen shake intensity
                    //   x: -5 px or +5 px
                    //   y: -5 px OR +5 px
                    ig.system.context.translate(5 * this.sgn(Math.random() - 0.5), 5 * this.sgn(Math.random() - 0.5));
                    this.parent();
                ig.system.context.restore();
                this.screenshaker = false;
            }

            // Player unit's stat screen menu
            if(ig.input.state('menu') && this.units[this.activeUnit].unitType === 'player') {
                var a = this.units[this.activeUnit];
                this.statScreen.draw(0, 0);
                a.statMugshot.draw(30, 40);
                this.font.draw(a.name,       150, 258, ig.Font.ALIGN.LEFT);
                this.font.draw(a.level,      80,  377, ig.Font.ALIGN.LEFT);
                this.font.draw(a.health,     90,  430, ig.Font.ALIGN.LEFT);
                this.font.draw(a.health_max, 140, 430, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.atk,   350, 95,  ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.mag,   350, 145, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.def,   350, 190, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.res,   350, 235, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.spd,   350, 285, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.luk,   350, 335, ig.Font.ALIGN.LEFT);
                //console.log(this.itemCatalog.Item1);
            }

            // Sraw small character modal, showing small sprite, HP and level.
            // Spawn this whenever the cursor is hovering on top of an entity.
            // Currently, we'll only focus on player modals.
            if(this.units[this.activeUnit].unitType === 'player' && this.hoveredUnit !== null) {
                // Draw small status screen modal
                this.hpModal.draw(0, 400);
                this.font.draw(this.hoveredUnit.health,     100, 445, ig.Font.ALIGN.LEFT);
                this.font.draw(this.hoveredUnit.health_max, 135, 445, ig.Font.ALIGN.LEFT);

                // Draw small character modal sprite
                // Bypass drawing character modal sprite if one does not exist (usually for enemy units)
                if(typeof this.hoveredUnit.modal !== 'undefined')
                    this.hoveredUnit.modal.draw(5, 420);
            }

            // Draw the terrain modal on cursor hover over in "free moving state".
            // Spawn this whenever a unit is not selected by the cursor entity.
            if(this.units[this.activeUnit].unitType === 'player' && this.clickedUnit === null && this.hoveredTerrain !== null) {
                this.terrainModal.draw(480, 400);
                this.font.draw(this.hoveredTerrain.type,  515, 426, ig.Font.ALIGN.LEFT);
                this.font.draw(this.hoveredTerrain.def,   570, 447, ig.Font.ALIGN.LEFT);
                this.font.draw(this.hoveredTerrain.avoid, 570, 459, ig.Font.ALIGN.LEFT);
            }

            // Battle animation overlay
            if((this.battleAnimStage === 'battle_prepare' || this.battleAnimStage === 'battle_start') && this.units[this.activeUnit] !== this.targetedUnit) {
                //console.log(this.units[this.activeUnit].name + ' attacks ' + this.targetedUnit.name + '!');
                var a = this.units[this.activeUnit];
                var t = this.targetedUnit;

                if(a.unitType === 'player' && t.unitType === 'enemy') {
                    var a_overlayDetailPos = [
                        {x: ig.system.width - 20, y: 30, align: ig.Font.ALIGN.RIGHT},     // Unit name
                        {x: ig.system.width - 5, y: 340, align: ig.Font.ALIGN.RIGHT},     // Unit stat: HIT
                        {x: ig.system.width - 5, y: 365, align: ig.Font.ALIGN.RIGHT},     // Unit stat: DMG
                        {x: ig.system.width - 5, y: 390, align: ig.Font.ALIGN.RIGHT},     // Unit stat: CRT
                        {x: ig.system.width / 2 + 25, y: 385, align: ig.Font.ALIGN.LEFT}, // Weapon image
                        {x: ig.system.width / 2 + 80, y: 385, align: ig.Font.ALIGN.LEFT}, // Weapon name
                        {x: ig.system.width / 2 + 30, y: 440, align: ig.Font.ALIGN.LEFT}, // Unit health
                        {x: ig.system.width / 2 + 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];

                    var t_overlayDetailPos = [
                        {x: 20, y: 30, align: ig.Font.ALIGN.LEFT},    // Unit name
                        {x: 100, y: 340, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: 100, y: 365, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: 100, y: 390, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: 130, y: 385, align: ig.Font.ALIGN.LEFT},  // Weapon image
                        {x: 180, y: 385, align: ig.Font.ALIGN.LEFT},  // Weapon name
                        {x: 30, y: 440, align: ig.Font.ALIGN.LEFT},   // Unit health
                        {x: 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];
                } else if(a.unitType === 'enemy' && t.unitType === 'player') {
                    var a_overlayDetailPos = [
                        {x: 20, y: 30, align: ig.Font.ALIGN.LEFT},    // Unit name
                        {x: 100, y: 340, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: 100, y: 365, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: 100, y: 390, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: 130, y: 385, align: ig.Font.ALIGN.LEFT},  // Weapon image
                        {x: 180, y: 385, align: ig.Font.ALIGN.LEFT},  // Weapon name
                        {x: 30, y: 440, align: ig.Font.ALIGN.LEFT},   // Unit health
                        {x: 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];

                    var t_overlayDetailPos = [
                        {x: ig.system.width - 20, y: 30, align: ig.Font.ALIGN.RIGHT},     // Unit name
                        {x: ig.system.width - 5, y: 340, align: ig.Font.ALIGN.RIGHT},     // Unit stat: HIT
                        {x: ig.system.width - 5, y: 365, align: ig.Font.ALIGN.RIGHT},     // Unit stat: DMG
                        {x: ig.system.width - 5, y: 390, align: ig.Font.ALIGN.RIGHT},     // Unit stat: CRT
                        {x: ig.system.width / 2 + 25, y: 385, align: ig.Font.ALIGN.LEFT}, // Weapon image
                        {x: ig.system.width / 2 + 80, y: 385, align: ig.Font.ALIGN.LEFT}, // Weapon name
                        {x: ig.system.width / 2 + 30, y: 440, align: ig.Font.ALIGN.LEFT}, // Unit health
                        {x: ig.system.width / 2 + 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];
                }

                // Prepare the battle animation sequence (do once)
                if(this.battleAnimStage === 'battle_prepare') {
                    // Spawn battle animation overlay
                    this.spawnEntity(EntityBattle_anim_overlay, ig.game.screen.x, ig.game.screen.y);

                    // Spawn active unit animation
                    var a_battleAnim = this.spawnEntity(a.battleAnim, 0, 0);
                    a_battleAnim.pos = {
                        x: ig.game.screen.x + ig.system.width / 2 - a_battleAnim.size.x / 2,
                        y: ig.game.screen.y + 300 - a_battleAnim.size.y
                    };

                    if(a.unitType === 'enemy')
                        a_battleAnim.flip = true;

                    // Push active unit animation into attack queue (initial attack)
                    this.attackQueue.push(a_battleAnim);

                    // Spawn target unit animation
                    var t_battleAnim = this.spawnEntity(t.battleAnim, 0, 0);
                    t_battleAnim.pos = {
                        x: ig.game.screen.x + ig.system.width / 2 - t_battleAnim.size.x / 2,
                        y: ig.game.screen.y + 300 - t_battleAnim.size.y
                    };

                    if(t.unitType === 'enemy')
                        t_battleAnim.flip = true;

                    // Push target unit animation into attack queue (counterattack)
                    this.attackQueue.push(t_battleAnim);

                    // If difference in units' speed is large enough, push higher speed unit animation into attack queue (second attack)
                    if(Math.abs(a.stat.spd - t.stat.spd) >= 5) {
                        if(a.stat.spd > t.stat.spd)
                            this.attackQueue.push(a_battleAnim);
                        else
                            this.attackQueue.push(t_battleAnim);
                    }

                    // Start the battle animation sequence
                    this.battleAnimStage = 'battle_start';
                    this.atkAnimTimer.reset();
                }

                // Active unit -------------------------------------------------
                this.font.draw(a.name,     a_overlayDetailPos[0].x, a_overlayDetailPos[0].y, a_overlayDetailPos[0].align);
                this.font.draw('100',      a_overlayDetailPos[1].x, a_overlayDetailPos[1].y, a_overlayDetailPos[1].align);
                this.font.draw('100',      a_overlayDetailPos[2].x, a_overlayDetailPos[2].y, a_overlayDetailPos[2].align);
                this.font.draw('100',      a_overlayDetailPos[3].x, a_overlayDetailPos[3].y, a_overlayDetailPos[3].align);
                this.font.draw('[IMG]',    a_overlayDetailPos[4].x, a_overlayDetailPos[4].y, a_overlayDetailPos[4].align);
                this.font.draw('Iron Axe', a_overlayDetailPos[5].x, a_overlayDetailPos[5].y, a_overlayDetailPos[5].align);
                this.font.draw(a.health,   a_overlayDetailPos[6].x, a_overlayDetailPos[6].y, a_overlayDetailPos[6].align);

                // Health border/background
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        a_overlayDetailPos[7].x,
                        a_overlayDetailPos[7].y,
                        a_overlayDetailPos[7].width,
                        a_overlayDetailPos[7].height
                    );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Health bar
                ig.system.context.fillStyle = 'rgb(75, 255, 75)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        a_overlayDetailPos[7].x + 1,
                        a_overlayDetailPos[7].y + 1,
                        a_overlayDetailPos[7].width * (a.health / a.health_max) - 2,
                        a_overlayDetailPos[7].height - 2
                    );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Target unit -------------------------------------------------
                this.font.draw(t.name,     t_overlayDetailPos[0].x, t_overlayDetailPos[0].y, t_overlayDetailPos[0].align);
                this.font.draw('100',      t_overlayDetailPos[1].x, t_overlayDetailPos[1].y, t_overlayDetailPos[1].align);
                this.font.draw('100',      t_overlayDetailPos[2].x, t_overlayDetailPos[2].y, t_overlayDetailPos[2].align);
                this.font.draw('100',      t_overlayDetailPos[3].x, t_overlayDetailPos[3].y, t_overlayDetailPos[3].align);
                this.font.draw('[IMG]',    t_overlayDetailPos[4].x, t_overlayDetailPos[4].y, t_overlayDetailPos[4].align);
                this.font.draw('Iron Axe', t_overlayDetailPos[5].x, t_overlayDetailPos[5].y, t_overlayDetailPos[5].align);
                this.font.draw(t.health,   t_overlayDetailPos[6].x, t_overlayDetailPos[6].y, t_overlayDetailPos[6].align);

                // Health border/background
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        t_overlayDetailPos[7].x,
                        t_overlayDetailPos[7].y,
                        t_overlayDetailPos[7].width,
                        t_overlayDetailPos[7].height
                    );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Health bar
                ig.system.context.fillStyle = 'rgb(75, 255, 75)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        t_overlayDetailPos[7].x + 1,
                        t_overlayDetailPos[7].y + 1,
                        t_overlayDetailPos[7].width * (t.health / t.health_max) - 2,
                        t_overlayDetailPos[7].height - 2
                    );
                ig.system.context.closePath();
                ig.system.context.fill();
            }

            // Screen fade transition effect
            if(this.screenFadeOut)
                this.screenFadeOut.draw();
            if(this.screenFadeIn)
                this.screenFadeIn.draw();
        } // End draw method
    }); // End ig.BattleMode

    /**
     *  ig.GameOver
     *  -----
     *  Displays the game over screen when the main player has been defeated or
     *  has failed the primary battle objective.
     */
    ig.GameOver = ig.BaseGame.extend({
        update: function() {
            this.parent();

            if(ig.input.pressed('leftClick') || ig.input.pressed('rightClick'))
                ig.system.setGame(ig.MainGame)
        }, // End update method

        draw: function() {
            this.parent();

            ig.system.context.fillStyle = 'rgb(0, 0, 0)';
            ig.system.context.beginPath();
                ig.system.context.rect(
                    this.screen.x,
                    this.screen.y,
                    this.screen.x,
                    this.screen.y
                );
            ig.system.context.closePath();
            ig.system.context.fill();

            var x = ig.system.width / 2;
            var y = ig.system.height / 2;
            this.font.draw('Game Over', x, y, ig.Font.ALIGN.CENTER);
            this.font.draw('Your main character have been defeated.', x, y + 40, ig.Font.ALIGN.CENTER);
            this.font.draw('Click to continue', x, y + 100, ig.Font.ALIGN.CENTER);
        } // End draw method
    }); // End ig.GameOver

    // IMPACTJS DEBUG SETTINGS OVERRIDE (for testing purposes only)
    //ig.Entity._debugShowBoxes = true;
    ig.Entity._debugShowVelocities = true;
    ig.Entity._debugShowNames = true;

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in ig.MainGame state with
    //   60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', ig.BattleMode, 60, 640, 480, 1);
}); // End .defines


//##############################################################################
//# Global functions                                                           #
//##############################################################################
/**
 *  object ig.global.alignToGrid(number pos_x, number pos_y)
 *  -----
 *  Aligns the provided coordinates to the nearest grid tile. Used to reposition
 *  entities back to grid in case they get knocked off alignment.
 *
 *  Precondition:
 *      pos_x: The current x-coordinate of the object.
 *      pos_y: The current y-coordinate of the object.
 *
 *  Postcondition:
 *      Returns an object of 2 properties {x: pos_x_aligned, y: pos_y_aligned},
 *      where pos_x_aligned and pos_y_aligned represents the aligned coordinates,
 *      respectively. If the entity or object uses the coordinates provided in
 *      the return value, it should align itself to the map rounded to the
 *      nearest multiple of ig.global.tilesize.
 *
 *  Example:
 *      // main.js
 *      ig.global.tilesize = 32;
 *
 *      // myEntity.js
 *      this.pos = {x: 36.59, y: 74.02}
 *      this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y);
 *      console.log(this.pos); // {x: 32, y: 64}
 */
ig.global.alignToGrid = function(pos_x, pos_y) {
    return {
        x: Math.floor(pos_x / ig.global.tilesize) * ig.global.tilesize,
        y: Math.floor(pos_y / ig.global.tilesize) * ig.global.tilesize
    };
};

/**
 *  void ig.global.killAllButtons(object btn)
 *  -----
 *  Custom kill() method to selectively delete all entities of object btn.
 */
ig.global.killAllButtons = function(btn) {
    var btns = ig.game.getEntitiesByType(btn);
    for(var b = 0; b < btns.length; b++)
        btns[b].kill();
    return;
}

