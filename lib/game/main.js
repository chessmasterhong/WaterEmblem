/**
 *  main.js
 *  -----
 *  Contains the core logic for the game.
 */


//##############################################################################
//# Global variables                                                           #
//##############################################################################
// Game variables
//   Variables stored and handled by the game logic and necessary for the game
//   to function properly.
ig.global.tilesize = 32;
ig.global.game_pos = {map: null, x: null, y: null};
ig.global.encounter = {zone: 0, spawn_min: 2, spawn_max: 2};

// User variables
//   Variables used to store and handle user's gameplay.
ig.global.main_player_name = 'Jaffar';
ig.global.party = [];


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
    //'game.levels.demo',
    'game.levels.battlefield',

    // Catalogs
    'game.catalogs.item_catalog', // Item catalog

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
        font: new ig.Font('media/04b03_20.font.png', {
            fontColor: '#ECEEA1',
            borderColor: '#00000',
            borderSize: 1,
            letterSpacing: -2
        }),

        font2: new ig.Font('media/04b03_16.font.png', {
            fontColor: '#ECEEA1',
            borderColor: '#00000',
            borderSize: 1,
            letterSpacing: -2
        }),

        font3: new ig.Font('media/04b03_12.font.png', {
            fontColor: '#ECEEA1',
            borderColor: '#00000',
            borderSize: 1,
            letterSpacing: -2
        }),

        tradeMenu: new ig.Image('media/gui/tradeMenu.png'),
        equipMenu: new ig.Image('media/gui/equipMenu.png'),
        statScreen: new ig.Image('media/gui/statscreen.png'),
        hpModal: new ig.Image('media/gui/hpbarmodal.png'),
        terrainModal: new ig.Image('media/gui/terrainModal.png'),
        weaponModal: new ig.Image('media/gui/weapon_bonus_modal.png'),
        battleSummaryModal: new ig.Image('media/gui/battle_summary_modal.png'),

        init: function() {
            // Bind keys to game actions
            ig.input.bind(ig.KEY.MOUSE1,      'leftClick' ); // Left Mouse Button: select option, interact with object/character, continue dialogue, etc.
            ig.input.bind(ig.KEY.MOUSE2,      'rightClick'); // Right Mouse Button: Display the game menu
            //ig.input.bind(ig.KEY.UP_ARROW,    'up'    ); // Up Arrow: move player or navigation up
            //ig.input.bind(ig.KEY.DOWN_ARROW,  'down'  ); // Down Arrow: move player or nagivation down
            //ig.input.bind(ig.KEY.LEFT_ARROW,  'left'  ); // Left Arrow: move player or navigation left
            //ig.input.bind(ig.KEY.RIGHT_ARROW, 'right' ); // Right Arrow: move player or navigation right
            //ig.input.bind(ig.KEY.W,           'up'    ); // W: move player or navigation up
            //ig.input.bind(ig.KEY.S,           'down'  ); // S: move player or navigation down
            //ig.input.bind(ig.KEY.A,           'left'  ); // A: move player or navigation left
            //ig.input.bind(ig.KEY.D,           'right' ); // D: move player or navigation right
            ig.input.bind(ig.KEY.C,           'camera'); // C: toggles camera to focus and follow cursor or active player
            ig.input.bind(ig.KEY.ESC,         'escape'); // Escape: cancel option/selection, undo, etc.
            ig.input.bind(ig.KEY.ENTER,       'menu'  ); // Enter: Opens up a "menu" on click. Only Temporary for testing.
            //ig.input.bind(ig.KEY.SHIFT,       'SHIFT' ); // Left/Right Shift
            //ig.input.bind(ig.KEY.CTRL ,       'CTRL'  ); // Left/Right Control
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
        screenshakeIntensity: 0, // Intensity of screen shaking

        // Battlefield properties
        battleState: null, // null: default
                           // 'attack': selecting unit to attack
                           // 'battle_prepare': in battle animation, preparing units
                           // 'battle_start': in battle animation, running battle sequence
                           // 'assist': selecting friendly unit to assist (heal, item, etc.)
                           // 'trade': selecting friendly unit to trade
                           // 'trading': trading with friendly unit in progress
        mapsize: null, // Full map size in pixels
        end_battle: false, // End battle flag (when map objectives are satisfied)
        units: [], // All units participating on battlefield
        activeUnit: 0, // Controlling unit
        partyMembers: 2, // Members in player's party (not including main player)
        attackTargets: [], // All units possible to be targeted for attacking
        assistTargets: [], // All units possible to be targeted for assisting
        targetedUnit: null, // Unit targeted on receiving end of action
        attackQueue: [], // Active unit and target unit attack queue
        attackQueueIndex: 0, // Current attack stage (index) of attack queue

        // Field terrains via tile index number
        //   http://impactjs.com/forums/help/get-tile-index-number-from-main-layer-tileset/page/1
        terrain: {
            1: {type: 'Plain',    move: 1, def: 0, avoid: 0             },
            2: {type: 'Fortress', move: 1, def: 2, avoid: 20, hp_rec: 10},
            3: {type: 'Forest',   move: 2, def: 1, avoid: 20            },
            4: {type: 'Mountain', move: 3, def: 1, avoid: 40            },
            5: {type: 'Sand',     move: 2, def: 0, avoid: 10            }
        },

        // Set up new item catalog
        itemCatalog: new ItemCatalog(),

        // Maps
        //levelVars: [LevelBattlefield],

        init: function() {
            this.parent();

            // Set up camera
            this.camera = new Camera(ig.system.width / 3, ig.system.height / 3, 5);
            this.camera.trap.size = {x: ig.system.width / 3, y: ig.system.height / 3};

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

            // Spawn party leader (main character)
            ig.global.party[0] = this.spawnEntity(
                EntityHero,
                Math.floor(this.mapsize.x * 0.75 / ig.global.tilesize) * ig.global.tilesize,
                Math.floor(this.mapsize.y * 0.5  / ig.global.tilesize) * ig.global.tilesize,
                {name: ig.global.main_player_name}
            );

            // Create an array of entities here for random spawning of entities.
            var party_members = [EntityFemale_mage];

            // Spawn party members (non-main character)
            for(var p = 1; p <= this.partyMembers; p++) {
                ig.global.party[p] = this.spawnEntity(
                    // Select a random unit from the array party_members and spawn
                    party_members[Math.floor(Math.random() * party_members.length)],
                    Math.floor(this.mapsize.x * 0.8 / ig.global.tilesize) * ig.global.tilesize,
                    Math.floor(this.mapsize.y / (this.partyMembers + 1) * p / ig.global.tilesize) * ig.global.tilesize
                );
            }

            // Add player and friendlies to total units in this battle
            this.units = this.units.concat(ig.global.party);

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

            this.clickedUnit = this.units[0];
            this.targetedUnit = this.units[0];

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
                if(this.units[this.activeUnit].unitType === 'player') {
                    this.clickedUnit = this.units[this.activeUnit];
                    this.targetedUnit = this.units[this.activeUnit];
                } else {
                    this.clickedUnit = null;
                    this.targetedUnit = null;
                }

                this.attackTargets = [];
                this.assistTargets = [];

                // DEBUG: used to check if activeUnit moved to next unit
                console.log('Active Unit: ' + this.activeUnit + ' (' + this.units[this.activeUnit].name + ')');

                // Check how many units have moved for this turn
                var units_moved = 0;
                for(var u = 0; u < this.units.length; u++) {
                    if(this.units[u].turnUsed)
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
            if(this.units[this.activeUnit] !== this.targetedUnit) {
                if(this.battleState === 'attack') {
                    // Player unit initiates the attack
                    if(this.units[this.activeUnit].unitType === 'player') {
                        // Target is an enemy unit
                        if(this.targetedUnit.unitType === 'enemy') {
                            // Find unit from list of available targets
                            for(var t = 0; t < this.attackTargets.length; t++) {
                                if(this.targetedUnit === this.attackTargets[t]) {
                                    this.battleState = 'battle_prepare';
                                    break;
                                }
                            }
                        }
                    // Enemy unit initiates the attack
                    } else if(this.units[this.activeUnit].unitType === 'enemy') {
                        // Target is a player unit
                        if(this.targetedUnit.unitType === 'player')
                            this.battleState = 'battle_prepare';
                        else {
                            this.attackQueue = []; // Reset attack queue
                            this.battleState = null; // End battle animation (stop displaying screen text)
                            this.units[this.activeUnit].turnUsed = true; // End active unit's turn
                        }
                    }

                    console.log(this.units[this.activeUnit].name + ' unit is standing on terrain: ' + this.getTerrain(this.units[this.activeUnit].pos.x, this.units[this.activeUnit].pos.y).type);
                    console.log(this.targetedUnit.name + ' unit is standing on terrain: ' + this.getTerrain(this.targetedUnit.pos.x, this.targetedUnit.pos.y).type);
                } else if(this.battleState === 'assist') {
                    // Player unit initiates the assist and target unit is a player unit
                    if(this.units[this.activeUnit].unitType === 'player' && this.targetedUnit.unitType === 'player') {
                        // Find unit from list of available targets
                        for(var t = 0; t < this.assistTargets.length; t++) {
                            if(this.targetedUnit === this.assistTargets[t]) {
                                console.log('Assisting ' + this.targetedUnit.name);
                                // TODO: Add assist functionality here
                                break;
                            }
                        }
                    }
                } else if(this.battleState === 'trade' || this.battleState === 'trading') {
                    // Player unit initiates the trade and target unit is a player unit
                    if(this.battleState === 'trade' && this.units[this.activeUnit].unitType === 'player' && this.targetedUnit.unitType === 'player') {
                        // Find unit from list of available targets
                        for(var t = 0; t < this.assistTargets.length; t++) {
                            if(this.targetedUnit === this.assistTargets[t]) {
                                console.log('Trading with ' + this.targetedUnit.name);
                                this.battleState = 'trading';
                                break;
                            }
                        }
                    // Player unit is trading with target unit
                    } else if(this.battleState === 'trading') {
                        // Display active unit's inventory
                        if(typeof ig.game.getEntityByName('btn_item_a0') === 'undefined') {
                            for(var i = 0; i < this.units[this.activeUnit].item.length; i++) {
                                ig.game.spawnEntity(Button, this.screen.x + 160, this.screen.y + (i + 1) * 32 + 200, {
                                    name: 'btn_item_a' + i,
                                    index: i,
                                    text: [ig.game.units[ig.game.activeUnit].item[i] !== null ? ig.game.units[ig.game.activeUnit].item[i].name : '----'],
                                    animSheet: new ig.AnimationSheet('media/gui/bigMenu.png', 200, 32),
                                    size: {x: 200, y: 32},

                                    pressedUp: function() {
                                        // Determine which item is being selected.
                                        ig.game.units[ig.game.activeUnit].selectedItemIndex = this.index;
                                    }
                                });
                            }
                        }

                        // Display target unit's inventory
                        if(typeof ig.game.getEntityByName('btn_item_t0') === 'undefined') {
                            for(var i = 0; i < this.targetedUnit.item.length; i++) {
                                ig.game.spawnEntity(Button, this.screen.x + 400, this.screen.y + (i + 1) * 32 + 200, {
                                    name: 'btn_item_t' + i,
                                    index: i,
                                    text: [ig.game.targetedUnit.item[i] !== null ? ig.game.targetedUnit.item[i].name : '----'],
                                    animSheet: new ig.AnimationSheet('media/gui/bigMenu.png', 200, 32),
                                    size: {x: 200, y: 32},

                                    pressedUp: function() {
                                        // Determine which item is being selected.
                                        ig.game.targetedUnit.selectedItemIndex = this.index;
                                    }
                                });
                            }
                        }

                        // An item from active unit's inventory and an item from target unit's inventory has been seelcted
                        if(this.units[this.activeUnit].selectedItemIndex !== null && this.targetedUnit.selectedItemIndex !== null) {
                            // Perform trade and update inventories
                            var trade = this.tradeItems(this.units[this.activeUnit].item, this.targetedUnit.item, this.units[this.activeUnit].selectedItemIndex, this.targetedUnit.selectedItemIndex);
                            this.units[this.activeUnit].item = trade.a;
                            this.targetedUnit.item = trade.b;

                            // Reset selected items
                            this.units[this.activeUnit].selectedItemIndex = null;
                            this.targetedUnit.selectedItemIndex = null;

                            // Kill all second tier buttons
                            ig.global.killAllButtons(Button);

                            // Respawn first tier buttons
                            ig.game.menuVisible = false;
                        }
                    }
                } else if(this.battleState === 'battle_start') {
                    // Initiate battle animation sequence

                    // Initial attack ----------------------------------------------
                    // Start battle sequence after some defined time
                    if(this.attackQueueIndex === 0 && this.atkAnimTimer.delta() > 1) {
                        // Active unit has not played their attack animation yet
                        if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.idle) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack0;
                            this.attackQueue[0].currentAnim.rewind();
                        // Active unit is playing their attack animation and is on animation frame just before striking
                        } else if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0 && this.attackQueue[0].currentAnim.loopCount >= 1) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack1;
                            this.attackQueue[0].currentAnim.rewind();

                            // Compute if active unit triggers critical hit on targeted unit
                            if(this.computeBattleCritChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                console.log('Critical hit');
                                // TODO: Active unit's critical attack animation goes here
                                this.screenshakeIntensity = 10;
                                this.targetedUnit.receiveDamage(this.computeBattleCritDamage(this.units[this.activeUnit], this.targetedUnit), this.units[this.activeUnit]); // Inflict critical damage
                            // No critical hit triggered, proceed to normal attack; compute if active unit lands a normal hit on targeted unit
                            } else if(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                // TODO: Active unit's normal attack animation goes here
                                this.screenshakeIntensity = 5;
                                this.targetedUnit.receiveDamage(this.computeBattleNormalDamage(this.units[this.activeUnit], this.targetedUnit), this.units[this.activeUnit]); // Inflict normal damage
                            } else {
                                console.log('Attack missed');
                                this.attackQueue[1].currentAnim = this.attackQueue[1].anims.dodge;
                                this.attackQueue[1].currentAnim.rewind();
                            }
                        // Active unit has finished playing their attack animation
                        } else if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack1 && this.attackQueue[0].currentAnim.loopCount >= 1) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.idle; // Prepare unit animation for possible second attack
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.idle; // Prepare unit animation for possible second attack
                            if(!this.targetedUnit._killed)
                                this.attackQueueIndex = 1; // Target unit is still alive; target unit's turn to counterattack
                            else
                                this.attackQueueIndex = 2; // Target unit is not alive; skip target unit's turn
                        }
                    // Counterattack -----------------------------------------------
                    } else if(this.attackQueueIndex === 1) {
                        // Target unit has not played their attack animation yet
                        if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.idle) {
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack0;
                            this.attackQueue[1].currentAnim.rewind();
                        // Target unit is playing their attack animation and is on animation frame just before striking
                        } else if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0 && this.attackQueue[1].currentAnim.loopCount >= 1) {
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack1;
                            this.attackQueue[1].currentAnim.rewind();

                            // Compute if targeted unit triggers critical hit on active unit unit
                            if(this.computeBattleCritChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                console.log('Critical Hit');
                                // TODO: Targeted unit's critical attack animation goes here
                                this.screenshakeIntensity = 10;
                                this.units[this.activeUnit].receiveDamage(this.computeBattleCritDamage(this.targetedUnit, this.units[this.activeUnit]), this.targetedUnit); // Inflict critical damage
                            // No critical hit triggered, proceed to normal attack; compute if targeted unit lands a normal hit on active unit
                            } else if(this.computeBattleNormalHitChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                // TODO: Targeted unit's normal attack animation goes here
                                this.screenshakeIntensity = 5;
                                this.units[this.activeUnit].receiveDamage(this.computeBattleNormalDamage(this.targetedUnit, this.units[this.activeUnit]), this.targetedUnit); // Inflict normal damage
                            } else {
                                console.log('Attack missed');
                                this.attackQueue[0].currentAnim = this.attackQueue[0].anims.dodge;
                                this.attackQueue[0].currentAnim.rewind();
                            }
                        // Target unit has finished playing their attack animation
                        } else if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack1 && this.attackQueue[1].currentAnim.loopCount >= 1) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.idle; // Prepare unit animation for possible second attack
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.idle; // Prepare unit animation for possible second attack
                            if(this.attackQueue.length >= 3) {
                                this.attackQueue[2].currentAnim = this.attackQueue[2].anims.idle;
                                this.attackQueue[2].currentAnim.rewind();
                            }
                            this.attackQueueIndex = 2;
                        }
                    } else if(this.attackQueueIndex === 2) {
                        // Clean up and end battle animation -----------------------
                        if(this.attackQueue.length === 2 || this.units[this.activeUnit]._killed || this.targetedUnit._killed || (this.attackQueue[2].currentAnim === this.attackQueue[2].anims.attack1 && this.attackQueue[2].currentAnim.loopCount >= 1)) {
                            // Handle experience gain and level up for player units
                            if(this.units[this.activeUnit].unitType === 'player' && this.targetedUnit.unitType === 'enemy') {
                                this.units[this.activeUnit].exp_curr += this.targetedUnit.kill_exp;
                                console.log(this.units[this.activeUnit].name + ' gained ' + this.targetedUnit.kill_exp + ' exp and now has ' + this.units[this.activeUnit].exp_curr + ' exp for current level ' + this.units[this.activeUnit].level + '.');

                                if(this.units[this.activeUnit].level < 20 && this.units[this.activeUnit].exp_curr >= this.units[this.activeUnit].exp_levelUp) {
                                    this.units[this.activeUnit].level++; // Increase level
                                    this.units[this.activeUnit].levelUpStats(); // Increase stats
                                    this.units[this.activeUnit].exp_curr -= this.units[this.activeUnit].exp_levelUp; // Subtract experience overflow from experience to level up.

                                    console.log(this.units[this.activeUnit].name + ' has reached level ' + this.units[this.activeUnit].level + '!');
                                    console.log(this.units[this.activeUnit].stat);
                                }
                            }

                            this.getEntityByName('battle_anim_overlay').kill(); // Kill overlay entity
                            this.attackQueue[0].kill(); // Kill unit animation entity
                            this.attackQueue[1].kill();  // Kill unit animation entity
                            if(this.attackQueue.length === 3)
                                this.attackQueue[2].kill();  // Kill unit animation entity
                            this.attackQueue = []; // Reset attack queue
                            this.attackQueueIndex = 0; // Reset attack queue index
                            this.battleState = null; // End battle animation (stop displaying screen text)
                            this.units[this.activeUnit].turnUsed = true; // End active unit's turn
                        // Second attack -------------------------------------------
                        // There is another unit in the attack queue and both units are alive
                        } else if(this.attackQueue.length >= 3) {
                            // Faster unit (unit with greater spd stat) has not played their attack animation yet
                            if(this.attackQueue[2].currentAnim === this.attackQueue[2].anims.idle) {
                                this.attackQueue[2].currentAnim = this.attackQueue[2].anims.attack0;
                                this.attackQueue[2].currentAnim.rewind();
                            // Faster unit is playing their attack animation and is on animation frame just befor striking
                            } else if(this.attackQueue[2].currentAnim === this.attackQueue[2].anims.attack0 && this.attackQueue[2].currentAnim.loopCount >= 1) {
                                this.attackQueue[2].currentAnim = this.attackQueue[2].anims.attack1;
                                this.attackQueue[2].currentAnim.rewind();

                                // Active unit is faster unit; active unit attacks second time
                                if(this.units[this.activeUnit].stat.spd > this.targetedUnit.stat.spd) {
                                    // Compute if active unit triggers critical hit on targeted unit
                                    if(this.computeBattleCritChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                        console.log('Critical hit');
                                        // TODO: Active unit's critical attack animation goes here
                                        this.screenshakeIntensity = 10;
                                        this.targetedUnit.receiveDamage(this.computeBattleCritDamage(this.units[this.activeUnit], this.targetedUnit), this.units[this.activeUnit]); // Inflict critical damage
                                    // No critical hit triggered, proceed to normal attack; compute if active unit lands a normal hit on targeted unit
                                    } else if(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                        // TODO: Active unit's normal attack animation goes here
                                        this.screenshakeIntensity = 5;
                                        this.targetedUnit.receiveDamage(this.computeBattleNormalDamage(this.units[this.activeUnit], this.targetedUnit), this.units[this.activeUnit]); // Inflict normal damage
                                    } else {
                                        console.log('Attack missed');
                                        // TODO: Targeted unit's dodge animation goes here
                                    }
                                // Targeted unit is faster unit; targeted unit attacks second time
                                } else {
                                    // Compute if targeted unit triggers critical hit on active unit unit
                                    if(this.computeBattleCritChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                        console.log('Critical hit');
                                        // TODO: Targeted unit's critical attack animation goes here
                                        this.screenshakeIntensity = 10;
                                        this.units[this.activeUnit].receiveDamage(this.computeBattleCritDamage(this.targetedUnit, this.units[this.activeUnit]), this.targetedUnit); // Inflict critical damage
                                    // No critical hit triggered, proceed to normal attack; compute if targeted unit lands a normal hit on active unit
                                    } else if(this.computeBattleNormalHitChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                        // TODO: Targeted unit's normal attack animation goes here
                                        this.screenshakeIntensity = 5;
                                        this.units[this.activeUnit].receiveDamage(this.computeBattleNormalDamage(this.targetedUnit, this.units[this.activeUnit]), this.targetedUnit); // Inflict normal damage
                                    } else {
                                        console.log('Attack missed');
                                        // TODO: Active unit's dodge animation goes here
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Menu escape and clicked unit deselection during player's turn
            if(ig.input.pressed('escape') || this.units[this.activeUnit].unitType !== 'player') {
                if(this.clickedUnit !== null && this.clickedUnit.unitType === 'player' && this.clickedUnit.vel.x === 0 && this.clickedUnit.vel.y === 0) {
                    this.clickedUnit.selectedItemIndex = null;
                    this.clickedUnit.selectedWeapon = null;
                    this.clickedUnit.isEquipping = false;
                    this.battleState = null;
                    this.attackTargets = [];
                    this.assistTargets = [];

                    if(this.clickedUnit.pos !== this.clickedUnit.init_pos) {
                        // User wants to undo/cancel the unit movement
                        this.clickedUnit = this.units[this.activeUnit];
                        this.targetedUnit = this.units[this.activeUnit];
                        this.clickedUnit.pos = this.clickedUnit.init_pos;
                        this.clickedUnit.mov_curr = this.clickedUnit.stat.mov;
                        this.clickedUnit.currentAnim = this.clickedUnit.anims.idle;
                    } else {
                        this.clickedUnit = null;
                        this.targetedUnit = null;
                    }
                }
                ig.global.killAllButtons(Button);
                this.menuVisible = false;
            }

            // Menu to prematurely end player's phase (end all player's unit turn)
            if(ig.input.state('rightClick') && !this.menuVisible && this.units[this.activeUnit].unitType === 'player' && this.units[this.activeUnit].vel.x === 0 && this.units[this.activeUnit].vel.y === 0) {
                this.menuVisible = true;

                this.spawnEntity(Button, ig.input.mouse.x + this.screen.x, ig.input.mouse.y + this.screen.y, {
                    name: 'btn_endTurn',
                    text: ['End Turn'],

                    pressedUp: function() {
                        // Set all player's units turn to used
                        for(var u = 0; u < ig.game.units.length - 1; u++) {
                            if(ig.game.units[u].unitType === 'player')
                                ig.game.units[u].turnUsed = true;
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
            if(this.battleState !== 'battle_start') {
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

        // Method to compute an entity's stats in one go
        recomputeStats: function(entity) {
            // Error checking for units with no equipped items
            if(entity.item[0] !== null) {
                var equippedItem = {
                    atk: entity.item[0].atk,
                    hit: entity.item[0].hit,
                    crit: entity.item[0].crit,
                    wt: entity.item[0].wt
                };
            } else
                var equippedItem = {atk: 0, hit: 0, crit: 0, wt: 0};

            // Compute atk = base str + item atk power
            entity.derived_stats.atk = Math.floor(entity.stat.str + equippedItem.atk);
            // Compute hit_rate = base skl / 2 + base luk / 2 + weapon hit rate
            entity.derived_stats.hit_rate = Math.floor(entity.stat.skl / 2 + entity.stat.luk / 2 + equippedItem.hit);
            // Compute crit rate = base skl / 2 + weapon crit rate
            entity.derived_stats.crit_rate = Math.floor(entity.stat.skl / 2 + equippedItem.crit);
            // Compute attack speed of entity
            if(entity.stat.wt > equippedItem.wt) {
                // If weight of unit is greater than weapon equipped, return base spd
                entity.derived_stats.attack_speed = Math.floor(entity.stat.spd);
            } else {
                // Attack speed = base spd - (weapon weight - player base wt stat)
                entity.derived_stats.attack_speed = Math.floor(entity.stat.spd - (equippedItem.wt - entity.stat.wt));
            }
            // Compute evade = attack_speed * 2 + base spd
            entity.derived_stats.evade = Math.floor(entity.derived_stats.attack_speed * 2 + entity.stat.spd);

            // Post-computation checks (clamp value at 0 if negative)
            if(entity.derived_stats.atk < 0)          entity.derived_stats.atk = 0;
            if(entity.derived_stats.hit_rate < 0)     entity.derived_stats.hit_rate = 0;
            if(entity.derived_stats.crit_rate < 0)    entity.derived_stats.crit_rate = 0;
            if(entity.derived_stats.attack_speed < 0) entity.derived_stats.attack_speed = 0;
            if(entity.derived_stats.evade < 0)        entity.derived_stats.evade = 0;

            return entity.derived_stats;
        },

        // Reordering items in a unit's inventory
        swapItems: function(item_array, index_a, index_b) {
            var temp = item_array[index_a];
            item_array[index_a] = item_array[index_b];
            item_array[index_b] = temp;
            console.log('Swapping Items');
            return item_array;
        },

        // Trading items between two unit's unventory
        tradeItems: function(item_array_a, item_array_b, index_a, index_b) {
            var temp = item_array_a[index_a];
            item_array_a[index_a] = item_array_b[index_b];
            item_array_b[index_b] = temp;
            return {a: item_array_a, b: item_array_b};
        },

        // Method to reset all of the values inside the mod property.
        clearMod: function() {
            ig.game.units[ig.game.activeUnit].mod.atk   = 0;
            ig.game.units[ig.game.activeUnit].mod.hit   = 0;
            ig.game.units[ig.game.activeUnit].mod.crit  = 0;
            ig.game.units[ig.game.activeUnit].mod.wt    = 0;
            ig.game.units[ig.game.activeUnit].mod.evade = 0;
            return ig.game.units[ig.game.activeUnit].mod;
        },

        // Compute attacker's hit chance for normal attack against target
        computeBattleNormalHitChance: function(attacker, target) {
            return attacker.derived_stats.hit_rate - target.derived_stats.evade > 0 ? attacker.derived_stats.hit_rate - target.derived_stats.evade : 0;
        },

        // Compute attacker's damage for normal attack against target
        computeBattleNormalDamage: function(attacker, target) {
            return attacker.derived_stats.atk - target.stat.def > 0 ? attacker.derived_stats.atk - target.stat.def : 0;
        },

        // Compute attacker's damage for critical attack against target
        computeBattleCritChance: function(attacker, target) {
            return attacker.derived_stats.crit_rate - target.stat.luk > 0 ? attacker.derived_stats.crit_rate - target.stat.luk : 0;
        },

        // Compute attacker's hit chance for critical attack against target
        computeBattleCritDamage: function(attacker, target) {
            return attacker.derived_stats.atk - target.stat.def > 0 ? (attacker.derived_stats.atk - target.stat.def) * 3 : 0;
        },

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

        draw: function() {
            if(this.screenshakeIntensity === 0)
                this.parent();
            else {
                // Modified sign/signum function. Extracts the sign of a real number
                // (returns -1 if negative or +1 if positive). If 0, return +1 (positive).
                var sgn = function(num) {
                    return !num ? (num > 0) - (num < 0) : 1;
                };

                // Modified screen shaking effect (no plugins)
                //   http://impactjs.com/forums/code/plugin-to-shake-the-screen/page/1
                ig.system.context.save();
                    // Screen shake intensity
                    //   x: -5 px or +5 px
                    //   y: -5 px OR +5 px
                    ig.system.context.translate(
                        this.screenshakeIntensity * sgn(Math.random() - 0.5),
                        this.screenshakeIntensity * sgn(Math.random() - 0.5)
                    );
                    this.parent();
                ig.system.context.restore();
                this.screenshakeIntensity = 0;
            }

            if(typeof ig.game.getEntityByName('btn_item_a0') && ig.game.battleState === 'trading'){
                var a = this.units[this.activeUnit];
                var t = this.targetedUnit;
                a.statMugshot.draw(160, 32);
                t.statMugshot.draw(400, 32);

                //console.log(typeof ig.game.getEntityByName('btn_item_a0'));
                console.log(ig.game.battleState === 'trading');
            }

            // Player unit's stat screen menu
            if(ig.input.state('menu') && this.units[this.activeUnit].unitType === 'player' && this.battleState !== 'battle_start') {
                var a = this.units[this.activeUnit];
                this.statScreen.draw(0, 0);
                a.statMugshot.draw(30, 40);
                this.font.draw(a.name,       115, 258, ig.Font.ALIGN.LEFT);
                this.font.draw(a.level,      80,  377, ig.Font.ALIGN.LEFT);
                this.font.draw(a.health,     80,  430, ig.Font.ALIGN.LEFT);
                this.font.draw(a.health_max, 130, 430, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.str,   350, 91,  ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.mag,   350, 141, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.def,   350, 186, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.res,   350, 231, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.spd,   350, 281, ig.Font.ALIGN.LEFT);
                this.font.draw(a.stat.luk,   350, 331, ig.Font.ALIGN.LEFT);
            }

            if(this.units[this.activeUnit].selectedWeapon !== null && this.units[this.activeUnit].isEquipping) {
                this.weaponModal.draw(400, 350);
                var a = this.units[this.activeUnit];
                var atkChange = a.stat.str + a.selectedWeapon.atk;
                var hitChange = a.stat.hit + a.selectedWeapon.hit;
                var critChange = a.stat.crit + a.selectedWeapon.crit;
                var evadeChange = a.mod.evade;
                //console.log(critChange);
                // Draw stats for new weapon
                a.statMugshot.draw(425, 150);
                this.font3.draw(a.derived_stats.atk + "->" + atkChange, 455, 405);
                this.font3.draw(a.derived_stats.hit_rate + "->" + hitChange, 440, 440);
                this.font3.draw(a.derived_stats.crit_rate + "->" + critChange, 570, 405);
                this.font3.draw(evadeChange, 590, 440);

            }
            // Draw small character modal, showing small sprite, HP and level.
            // Spawn this whenever the cursor is hovering on top of an entity.
            // Currently, we'll only focus on player modals.
            if(this.units[this.activeUnit].unitType === 'player' && this.battleState !== 'battle_start' && this.hoveredUnit !== null) {
                // Draw small status screen modal
                this.hpModal.draw(0, 400);
                this.font2.draw(this.hoveredUnit.health,     100, 443, ig.Font.ALIGN.LEFT);
                this.font2.draw(this.hoveredUnit.health_max, 135, 443, ig.Font.ALIGN.LEFT);

                // Draw small character modal sprite
                // Bypass drawing character modal sprite if one does not exist (usually for enemy units)
                if(typeof this.hoveredUnit.modal !== 'undefined')
                    this.hoveredUnit.modal.draw(5, 420);
            }

            // Draw the terrain modal on cursor hover over in "free moving state".
            // Spawn this whenever a unit is not selected by the cursor entity.
            if(this.units[this.activeUnit].unitType === 'player' && this.battleState !== 'battle_start' && this.clickedUnit === null && this.hoveredTerrain !== null) {
                this.terrainModal.draw(480, 400);
                this.font2.draw(this.hoveredTerrain.type,  515, 426, ig.Font.ALIGN.LEFT);
                this.font3.draw(this.hoveredTerrain.def,   570, 447, ig.Font.ALIGN.LEFT);
                this.font3.draw(this.hoveredTerrain.avoid, 570, 459, ig.Font.ALIGN.LEFT);
            }

            // Draw battle summery modal on cursor hover while selecting an enemy to attack
            if(this.battleState === 'attack' && this.units[this.activeUnit] === this.targetedUnit) {
                if(this.hoveredUnit !== null && this.attackTargets.length > 0) {
                    for(var i = 0; i < this.attackTargets.length; i++) {
                        if(this.hoveredUnit === this.attackTargets[i]) {
                            this.battleSummaryModal.draw(520, 0);
                            this.font2.draw(this.units[this.activeUnit].name, 565, 10);
                            this.font2.draw(this.units[this.activeUnit].health, 605, 45);
                            this.font2.draw(this.hoveredUnit.health, 553, 45, ig.Font.ALIGN.RIGHT);
                            this.font2.draw(this.computeBattleNormalDamage(this.units[this.activeUnit], this.hoveredUnit), 605, 80);
                            this.font2.draw(this.computeBattleNormalDamage(this.hoveredUnit, this.units[this.activeUnit]), 553, 80, ig.Font.ALIGN.RIGHT);
                            this.font2.draw(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.hoveredUnit), 605, 115);
                            this.font2.draw(this.computeBattleNormalHitChance(this.hoveredUnit, this.units[this.activeUnit]), 553, 115, ig.Font.ALIGN.RIGHT);
                            this.font2.draw(this.computeBattleCritChance(this.units[this.activeUnit], this.hoveredUnit), 553, 150, ig.Font.ALIGN.RIGHT);
                            this.font2.draw(this.computeBattleCritChance(this.hoveredUnit, this.units[this.activeUnit]), 605, 145);
                            break;
                        }
                    }
                }
            }

            // Battle animation overlay
            if((this.battleState === 'battle_prepare' || this.battleState === 'battle_start') && this.units[this.activeUnit] !== this.targetedUnit) {
                var a = this.units[this.activeUnit];
                var t = this.targetedUnit;

                if(a.unitType === 'player' && t.unitType === 'enemy') {
                    var a_overlayDetailPos = [
                        {x: ig.system.width - 20,     y: 25,  align: ig.Font.ALIGN.RIGHT}, // Unit name
                        {x: ig.system.width - 5,      y: 337, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: ig.system.width - 5,      y: 362, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: ig.system.width - 5,      y: 387, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: ig.system.width / 2 + 25, y: 372                            }, // Weapon image
                        {x: ig.system.width / 2 + 70, y: 382, align: ig.Font.ALIGN.LEFT }, // Weapon name
                        {x: ig.system.width / 2 + 65, y: 437, align: ig.Font.ALIGN.RIGHT}, // Unit numeric health
                        {x: ig.system.width / 2 + 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];

                    var t_overlayDetailPos = [
                        {x: 20,  y: 25,  align: ig.Font.ALIGN.LEFT }, // Unit name
                        {x: 100, y: 337, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: 100, y: 362, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: 100, y: 387, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: 130, y: 372                            }, // Weapon image
                        {x: 170, y: 382, align: ig.Font.ALIGN.LEFT }, // Weapon name
                        {x: 65,  y: 437, align: ig.Font.ALIGN.RIGHT}, // Unit numeric health
                        {x: 74,  y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];
                } else if(a.unitType === 'enemy' && t.unitType === 'player') {
                    var a_overlayDetailPos = [
                        {x: 20,  y: 25,  align: ig.Font.ALIGN.LEFT }, // Unit name
                        {x: 100, y: 337, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: 100, y: 362, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: 100, y: 387, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: 130, y: 372                            }, // Weapon image
                        {x: 170, y: 382, align: ig.Font.ALIGN.LEFT }, // Weapon name
                        {x: 65,  y: 437, align: ig.Font.ALIGN.RIGHT}, // Unit numeric health
                        {x: 74,  y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];

                    var t_overlayDetailPos = [
                        {x: ig.system.width - 20,     y: 25,  align: ig.Font.ALIGN.RIGHT}, // Unit name
                        {x: ig.system.width - 5,      y: 337, align: ig.Font.ALIGN.RIGHT}, // Unit stat: HIT
                        {x: ig.system.width - 5,      y: 362, align: ig.Font.ALIGN.RIGHT}, // Unit stat: DMG
                        {x: ig.system.width - 5,      y: 387, align: ig.Font.ALIGN.RIGHT}, // Unit stat: CRT
                        {x: ig.system.width / 2 + 25, y: 372                            }, // Weapon image
                        {x: ig.system.width / 2 + 70, y: 382, align: ig.Font.ALIGN.LEFT }, // Weapon name
                        {x: ig.system.width / 2 + 65, y: 437, align: ig.Font.ALIGN.RIGHT}, // Unit numeric health
                        {x: ig.system.width / 2 + 74, y: 440, width: 200 * ig.system.scale, height: 14 * ig.system.scale} // Health bar
                    ];
                }

                // Prepare the battle animation sequence (do once)
                if(this.battleState === 'battle_prepare') {
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
                    this.battleState = 'battle_start';
                    this.atkAnimTimer.reset();
                }

                // Active unit -------------------------------------------------
                this.font.draw(a.name,                                       a_overlayDetailPos[0].x, a_overlayDetailPos[0].y, a_overlayDetailPos[0].align);
                this.font.draw(this.computeBattleNormalHitChance(a, t),      a_overlayDetailPos[1].x, a_overlayDetailPos[1].y, a_overlayDetailPos[1].align);
                this.font.draw(this.computeBattleNormalDamage(a, t),         a_overlayDetailPos[2].x, a_overlayDetailPos[2].y, a_overlayDetailPos[2].align);
                this.font.draw(this.computeBattleCritChance(a, t),           a_overlayDetailPos[3].x, a_overlayDetailPos[3].y, a_overlayDetailPos[3].align);
                if(a.item[0] !== null) a.item[0].icon.draw(                  a_overlayDetailPos[4].x, a_overlayDetailPos[4].y                             );
                this.font.draw(a.item[0] !== null ? a.item[0].name : '----', a_overlayDetailPos[5].x, a_overlayDetailPos[5].y, a_overlayDetailPos[5].align);
                this.font.draw(a.health,                                     a_overlayDetailPos[6].x, a_overlayDetailPos[6].y, a_overlayDetailPos[6].align);

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
                this.font.draw(t.name,                                       t_overlayDetailPos[0].x, t_overlayDetailPos[0].y, t_overlayDetailPos[0].align);
                this.font.draw(this.computeBattleNormalHitChance(t, a),      t_overlayDetailPos[1].x, t_overlayDetailPos[1].y, t_overlayDetailPos[1].align);
                this.font.draw(this.computeBattleNormalDamage(t, a),         t_overlayDetailPos[2].x, t_overlayDetailPos[2].y, t_overlayDetailPos[2].align);
                this.font.draw(this.computeBattleCritChance(t, a),           t_overlayDetailPos[3].x, t_overlayDetailPos[3].y, t_overlayDetailPos[3].align);
                if(t.item[0] !== null) t.item[0].icon.draw(                  t_overlayDetailPos[4].x, t_overlayDetailPos[4].y                             );
                this.font.draw(t.item[0] !== null ? t.item[0].name : '----', t_overlayDetailPos[5].x, t_overlayDetailPos[5].y, t_overlayDetailPos[5].align);
                this.font.draw(t.health,                                     t_overlayDetailPos[6].x, t_overlayDetailPos[6].y, t_overlayDetailPos[6].align);

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

