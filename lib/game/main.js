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
ig.global.encounter = {zone: 0, spawn_min: 2, spawn_max: 4};

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
    'game.entities.animations.wyvernKnight_battleanim',

    // PC and NPC battle animations
    'game.entities.animations.hero_battleanim', // Main character
    'game.entities.animations.mage_battleanim',
    'game.entities.animations.wyvernLord_battleanim',
    'game.entities.animations.enemy_assassin_battleanim',
    'game.entities.animations.enemy_wyvernLord_battleanim',
    'game.entities.animations.lord_battleanim',
    'game.entities.animations.cavalier_battleanim',
    'game.entities.animations.advancedHero_battleanim',
    'game.entities.animations.general_battleanim',
    'game.entities.animations.king_battleanim',
    'game.entities.animations.dracozombie_battleanim',

    // Generators and Objects
    'game.entities.misc.enemy_spawner', // Random enemy spawner entity
    'game.entities.misc.pointer', // Mouse cursor entity

    // Overlays and layer controllers
    'game.entities.overlays.battle_anim_gui', // Battle animation data display layer
    'game.entities.overlays.battle_anim_effects', // Battle animation effects layer controller
    'game.entities.overlays.battle_anim_terrains', // Battle animation terrains layer controller
    'game.entities.overlays.battle_anim_background', // Battle animation background layer controller

    'game.entities.menus.button_trade_item_active',
    'game.entities.menus.button_trade_item_target',
    'game.entities.menus.button_endturn',

    // Levels/Maps
    //'game.levels.demo',
    'game.levels.battlefield',
    'game.levels.castle',
    'game.levels.big_castle',

    // Catalogs
    'game.catalogs.item_catalog', // Item catalog

    // Plugins
    'plugins.astar.astar-for-entities', // A* search algorithm for pathfinding
    //'plugins.astar.astar-for-entities-debug', // <-- DEVELOPMENT DEBUG ONLY
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
        font20_default: new ig.Font('media/04b03_20.font.png', { fontColor: '#ECEEA1', borderColor: '#404040' }),
        font16_default: new ig.Font('media/04b03_16.font.png', { fontColor: '#ECEEA1', borderColor: '#404040' }),
        font12_default: new ig.Font('media/04b03_12.font.png', { fontColor: '#ECEEA1', borderColor: '#404040' }),
        font20_green:   new ig.Font('media/04b03_20.font.png', { fontColor: '#3CDC3C', borderColor: '#404040' }),
        font16_green:   new ig.Font('media/04b03_16.font.png', { fontColor: '#3CDC3C', borderColor: '#404040' }),
        font12_green:   new ig.Font('media/04b03_12.font.png', { fontColor: '#3CDC3C', borderColor: '#404040' }),
        font20_red:     new ig.Font('media/04b03_20.font.png', { fontColor: '#DC3C3C', borderColor: '#404040' }),
        font16_red:     new ig.Font('media/04b03_16.font.png', { fontColor: '#DC3C3C', borderColor: '#404040' }),
        font12_red:     new ig.Font('media/04b03_12.font.png', { fontColor: '#DC3C3C', borderColor: '#404040' }),
        font20_black:   new ig.Font('media/04b03_20.font.png', { fontColor: '#000000', letterSpacing: -1 }),
        font16_black:   new ig.Font('media/04b03_16.font.png', { fontColor: '#000000', letterSpacing: -1 }),
        font12_black:   new ig.Font('media/04b03_12.font.png', { fontColor: '#000000', letterSpacing: -1 }),

        tradeMenu: new ig.Image('media/gui/tradeMenu.png'),
        equipMenu: new ig.Image('media/gui/equipMenu.png'),
        statScreen: new ig.Image('media/gui/statscreen.png'),
        hpModal: new ig.Image('media/gui/hpModal.png'),
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
                           // 'battle_transition': transitioning in to or out of battle animation
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

        // Battle animation properties
        battleAnimControllers: {gui: null, effects: null, terrains: null, background: null},
        attackTargets: [], // All units possible to be targeted for attacking
        assistTargets: [], // All units possible to be targeted for assisting
        targetedUnit: null, // Unit targeted on receiving end of action
        attackQueue: [], // Active unit and target unit attack queue
        attackQueueIndex: 0, // Current attack stage (index) of attack queue
        battleAnimStats: {activeUnit: null, targetedUnit: null},

        // Field terrains via tile index number
        //   http://impactjs.com/forums/help/get-tile-index-number-from-main-layer-tileset/page/1
        terrain: {
            1: {type: 'Plain',    move: 1, def: 0, avoid: 0             },
            2: {type: 'Fortress', move: 1, def: 2, avoid: 20, hp_rec: 10},
            3: {type: 'Forest',   move: 2, def: 1, avoid: 20            },
            4: {type: 'Mountain', move: 3, def: 1, avoid: 40            },
            5: {type: 'Sand',     move: 2, def: 0, avoid: 10            },
            6: {type: 'Armory',   move: 0, def: 1, avoid: 10,           },
            7: {type: 'Shop',     move: 0, def: 1, avoid: 10,           },
            8: {type: 'Castle',   move: 0, def: 0, avoid: 0,            },
        },

        // Set up new item catalog
        itemCatalog: new ItemCatalog(),

        // Maps
        levels: [LevelBig_castle, LevelBattlefield],

        init: function() {
            this.parent();

            // Set up camera
            this.camera = new Camera(ig.system.width / 3, ig.system.height / 3, 5);
            this.camera.trap.size = {x: ig.system.width / 3, y: ig.system.height / 3};

            // Load map
            this.director = new ig.Director(this, this.levels);
            this.director.firstLevel();

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
                800, //Math.floor(this.mapsize.x * 0.75 / ig.global.tilesize) * ig.global.tilesize,
                576, //Math.floor(this.mapsize.y * 0.5  / ig.global.tilesize) * ig.global.tilesize,
                {name: ig.global.main_player_name}
            );

            // Create an array of entities here for random spawning of entities.
            var party_members = [EntityFemale_mage];
            // Spawn party members (non-main character)
            var party_members_pool = [EntityWyvern_lord, EntityFemale_mage, EntityLord];
            for(var p = 1; p <= party_members_pool.length; p++) {
                // Align party members relative to party leader (main character)
                var party_member_pos = ig.global.alignToGrid(
                    ig.global.party[0].pos.x + 2 * ig.global.tilesize,
                    ig.global.party[0].pos.y - (party_members_pool.length + party_members_pool.length * ig.global.tilesize) + p * 2 * ig.global.tilesize
                );
                ig.global.party[p] = this.spawnEntity(party_members_pool[p - 1], party_member_pos.x, party_member_pos.y);
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
        }, // End init method

        update: function() {
            this.parent();

            // Handle unit movement order
            if(this.units[this.activeUnit].turnUsed) {
                this.activeUnit = (this.activeUnit + 1) % this.units.length;

                /*var player_phase = false;
                for(var u = 0; u < this.units.length; u++) {
                    if(this.units[u].unitType === 'player' && !this.units[u].turnUsed) {
                        player_phase = true;
                        break;
                    }
                }

                if(player_phase === false) {
                    for(var u = 0; u < this.units.length; u++) {
                        if(this.units[u].unitType === 'player')
                            this.activeUnit = (this.activeUnit + 1) % this.units.length;
                        else {
                            console.log('Enemy\'s phase.');
                            break;
                        }
                    }
                }*/

                // Clean buttons
                this.menuVisible = false;
                ig.global.killAllButtons(Button);

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
                                    this.fadeInToBattleAnim();
                                    this.battleState = 'battle_transitionIn';
                                    break;
                                }
                            }
                        }
                    // Enemy unit initiates the attack
                    } else if(this.units[this.activeUnit].unitType === 'enemy') {
                        // Target is a player unit
                        if(this.targetedUnit.unitType === 'player') {
                            this.fadeInToBattleAnim();
                            this.battleState = 'battle_transitionIn';
                        } else {
                            this.attackQueue = []; // Reset attack queue
                            this.battleState = null; // End battle animation (stop displaying screen text)
                            this.units[this.activeUnit].turnUsed = true; // End active unit's turn
                        }
                    }
                } else if(this.battleState === 'assist') {
                    // Player unit initiates the assist and target unit is a player unit
                    if(this.units[this.activeUnit].unitType === 'player' && this.targetedUnit.unitType === 'player') {
                        // Find unit from list of available targets
                        for(var t = 0; t < this.assistTargets.length; t++) {
                            if(this.targetedUnit === this.assistTargets[t]) {
                                this.targetedUnit.receiveDamage(this.units[this.activeUnit].item[0].atk - this.units[this.activeUnit].stat.mag, this.units[this.activeUnit]);
                                this.units[this.activeUnit].turnUsed = true;
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
                                this.battleState = 'trading';
                                break;
                            }
                        }
                    // Player unit is trading with target unit
                    } else if(this.battleState === 'trading') {
                        // Display active unit's inventory
                        if(typeof this.getEntityByName('btn_item_a0') === 'undefined')
                            for(var i = 0; i < this.units[this.activeUnit].item.length; i++)
                                this.spawnEntity(EntityButton_trade_item_active, this.screen.x + 160, this.screen.y + (i + 1) * 32 + 200, {index: i});

                        // Display target unit's inventory
                        if(typeof this.getEntityByName('btn_item_t0') === 'undefined')
                            for(var i = 0; i < this.targetedUnit.item.length; i++)
                                this.spawnEntity(EntityButton_trade_item_target, this.screen.x + 400, this.screen.y + (i + 1) * 32 + 200, {index: i});

                        // An item from active unit's inventory and an item from target unit's inventory has been seelcted
                        if(this.units[this.activeUnit].selectedItemIndex !== null && this.targetedUnit.selectedItemIndex !== null) {
                            // Perform trade and update inventories
                            this.tradeItems(this.units[this.activeUnit], this.targetedUnit, this.units[this.activeUnit].selectedItemIndex, this.targetedUnit.selectedItemIndex);

                            // Reset selected items
                            this.units[this.activeUnit].selectedItemIndex = null;
                            this.targetedUnit.selectedItemIndex = null;

                            this.menuVisible = false;
                            ig.global.killAllButtons(Button);
                        }
                    }
                } else if(this.battleState === 'battle_prepare') {
                    // Prepare the battle animation sequence

                    // Store active unit and targeted unit battle stats into temporary property (to prevent null stats on unit defeat)
                    this.battleAnimStats.activeUnit = {
                        name:          this.units[this.activeUnit].name,
                        unitType:      this.units[this.activeUnit].unitType,
                        health:        this.units[this.activeUnit].health,
                        health_max:    this.units[this.activeUnit].health_max,
                        stat:          this.units[this.activeUnit].stat,
                        derived_stats: this.units[this.activeUnit].derived_stats,
                        mod:           this.units[this.activeUnit].mod,
                        item:          this.units[this.activeUnit].item
                    };

                    this.battleAnimStats.targetedUnit = {
                        name:          this.targetedUnit.name,
                        unitType:      this.targetedUnit.unitType,
                        health:        this.targetedUnit.health,
                        health_max:    this.targetedUnit.health_max,
                        stat:          this.targetedUnit.stat,
                        derived_stats: this.targetedUnit.derived_stats,
                        mod:           this.targetedUnit.mod,
                        item:          this.targetedUnit.item
                    };

                    // Layer 1: Battle animation background
                    if(this.battleAnimControllers.background === null)
                        this.battleAnimControllers.background = this.spawnEntity(EntityBattle_anim_background, this.screen.x, this.screen.y);

                    var activeUnit_terrain = this.getTerrain(this.units[this.activeUnit].pos.x, this.units[this.activeUnit].pos.y).type;
                    this.battleAnimControllers.background.currentAnim =
                        activeUnit_terrain === 'Plain'    ? this.battleAnimControllers.background.anims.plains :
                        activeUnit_terrain === 'Fortress' ? this.battleAnimControllers.background.anims.fortress :
                        activeUnit_terrain === 'Forest'   ? this.battleAnimControllers.background.anims.forest :
                        activeUnit_terrain === 'Mountain' ? this.battleAnimControllers.background.anims.mountain :
                        activeUnit_terrain === 'Castle'   ? this.battleAnimControllers.background.anims.castle :
                        //activeUnit_terrain === 'Sand'     ? this.battleAnimControllers.background.anims.sand :
                        this.battleAnimControllers.background.anims.plains;

                    // Layer 2: Battle animation terrain
                    if(this.battleAnimControllers.terrains === null)
                        this.battleAnimControllers.terrains = this.spawnEntity(EntityBattle_anim_terrains, this.screen.x, this.screen.y);
                    this.battleAnimControllers.terrains.currentAnim = this.battleAnimControllers.terrains.anims.blank;

                    // Layer 3: Battle animation units
                    // Spawn active unit animation
                    var a_battleAnim = this.spawnEntity(this.units[this.activeUnit].battleAnim, 0, 0);
                    a_battleAnim.pos = {
                        x: this.screen.x + ig.system.width / 2 - a_battleAnim.size.x / 2,
                        y: this.screen.y + 300 - a_battleAnim.size.y
                    };

                    if(this.units[this.activeUnit].unitType === 'enemy')
                        a_battleAnim.flip = true;

                    // Push active unit animation into attack queue (initial attack)
                    this.attackQueue.push(a_battleAnim);

                    // Spawn target unit animation
                    var t_battleAnim = this.spawnEntity(this.targetedUnit.battleAnim, 0, 0);
                    t_battleAnim.pos = {
                        x: this.screen.x + ig.system.width / 2 - t_battleAnim.size.x / 2,
                        y: this.screen.y + 300 - t_battleAnim.size.y
                    };

                    if(this.targetedUnit.unitType === 'enemy')
                        t_battleAnim.flip = true;

                    // Push target unit animation into attack queue (counterattack)
                    this.attackQueue.push(t_battleAnim);

                    // Layer 4: Battle animation effects
                    if(this.battleAnimControllers.effects === null)
                        this.battleAnimControllers.effects = this.spawnEntity(EntityBattle_anim_effects, this.screen.x, this.screen.y);

                    // Layer 5: Battle animation data display
                    if(this.battleAnimControllers.gui === null)
                        this.battleAnimControllers.gui = this.spawnEntity(EntityBattle_anim_gui, this.screen.x, this.screen.y);
                    this.battleAnimControllers.gui.currentAnim = this.battleAnimControllers.gui.anims.showGUI;

                    // If difference in units' speed is large enough, push higher speed unit animation into attack queue (second attack)
                    if(Math.abs(this.units[this.activeUnit].stat.spd - this.targetedUnit.stat.spd) >= 5) {
                        if(this.units[this.activeUnit].stat.spd > this.targetedUnit.stat.spd)
                            this.attackQueue.push(a_battleAnim);
                        else
                            this.attackQueue.push(t_battleAnim);
                    }

                    // Realign layers back to screen view
                    this.battleAnimControllers.background.pos = {x: this.screen.x, y: this.screen.y};
                    this.battleAnimControllers.terrains.pos = {x: this.screen.x, y: this.screen.y};
                    this.battleAnimControllers.effects.pos = {x: this.screen.x, y: this.screen.y};
                    this.battleAnimControllers.gui.pos = {x: this.screen.x, y: this.screen.y};

                    // Start the battle animation sequence
                    this.menuVisible = true;
                    this.atkAnimTimer.reset();
                    ig.global.killAllButtons(Button);
                    this.battleState = 'battle_start';
                // Initiate battle animation sequence ------------------------------------------------------------
                } else if(this.battleState === 'battle_start') {
                    // Start battle sequence after some defined time
                    // Initial attack ------------------------------------------
                    if(this.attackQueueIndex === 0 && this.atkAnimTimer.delta() > 1) {
                        // Active unit has not started their attack animation yet
                        if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.idle) {
                            console.log(this.battleAnimStats.activeUnit.name + ' vs. ' + this.battleAnimStats.targetedUnit.name);

                            // Compute if active unit triggers critical hit on target unit
                            if(this.computeBattleCritChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                // Play active unit's critical attack animation
                                this.attackQueue[0].currentAnim = this.attackQueue[0].anims.crit0;
                                this.attackQueue[0].currentAnim.rewind();
                            // No critical hit triggered --> Proceed to normal attack (compute hit/miss later)
                            } else {
                                // Play active unit's normal attack animation
                                this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack0;
                                this.attackQueue[0].currentAnim.rewind();
                            }
                        // Active unit is on the attack (normal or critical) frame where it is about to strike target unit
                        } else if((this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0 || this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit0) && this.attackQueue[0].currentAnim.loopCount >= 1) {
                            // Active unit is running critical hit animation
                            if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit0) {
                                // Continue running next set of critical hit animation
                                this.attackQueue[0].currentAnim = this.attackQueue[0].anims.crit1;
                                this.attackQueue[0].currentAnim.rewind();

                                // Compute if active unit's attack hit or missed
                                // Active unit's attack hit
                                if(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                    console.log('Critical hit');

                                    this.screenshakeIntensity = 10;

                                    // Compute damage
                                    this.battleAnimStats.targetedUnit.health -= this.computeBattleCritDamage(this.units[this.activeUnit], this.targetedUnit);

                                    // Do post-damage health checks and clamp health to valid values
                                    if(this.battleAnimStats.targetedUnit.health < 0)
                                        this.battleAnimStats.targetedUnit.health = 0;
                                    else if(this.battleAnimStats.targetedUnit.health > this.battleAnimStats.targetedUnit.health_max)
                                        this.battleAnimStats.targetedUnit.health = this.battleAnimStats.targetedUnit.health_max;
                                // Active unit's attack missed
                                } else {
                                    console.log('Attack missed');

                                    // Play target unit's dodge animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.dodge;
                                    this.attackQueue[1].currentAnim.rewind();
                                }

                                // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                    this.units[this.activeUnit].item_uses[0]--;
                                    if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                        console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                        this.units[this.activeUnit].item[0] = null;
                                        this.units[this.activeUnit].item_uses[0] = 0;
                                    }
                                }
                            // Active unit is running normal hit animation
                            } else if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0) {
                                // Continue running next set of normal hit animation
                                this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack1;
                                this.attackQueue[0].currentAnim.rewind();

                                // Battle animation screen effects
                                if(this.battleAnimStats.activeUnit.item[0] === this.itemCatalog.tome1) {
                                    this.battleAnimControllers.effects.currentAnim = this.battleAnimControllers.effects.anims.fimbulvetr;
                                    this.battleAnimControllers.effects.currentAnim.rewind();
                                } else if(this.battleAnimStats.activeUnit.item[0] === this.itemCatalog.tome3) {
                                    this.battleAnimControllers.effects.currentAnim = this.battleAnimControllers.effects.anims.excalibur;
                                    this.battleAnimControllers.effects.currentAnim.rewind();
                                }

                                // Compute if active unit's attack hit or missed
                                // Active unit's attack hit
                                if(this.computeBattleNormalHitChance(this.units[this.activeUnit],this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                    console.log('Normal hit');

                                    this.screenshakeIntensity = 5;

                                    // Compute damage
                                    this.battleAnimStats.targetedUnit.health -= this.computeBattleNormalDamage(this.units[this.activeUnit], this.targetedUnit);

                                    // Do post-damage health checks and clamp health to valid values
                                    if(this.battleAnimStats.targetedUnit.health < 0)
                                        this.battleAnimStats.targetedUnit.health = 0;
                                    else if(this.battleAnimStats.targetedUnit.health > this.battleAnimStats.targetedUnit.health_max)
                                        this.battleAnimStats.targetedUnit.health = this.battleAnimStats.targetedUnit.health_max;
                                // Active unit's attack missed
                                } else {
                                    console.log('Attack missed');

                                    // Play target unit's dodge animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.dodge;
                                    this.attackQueue[1].currentAnim.rewind();
                                }

                                // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                    this.units[this.activeUnit].item_uses[0]--;
                                    if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                        console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                        this.units[this.activeUnit].item[0] = null;
                                        this.units[this.activeUnit].item_uses[0] = 0;
                                    }
                                }
                            }
                        // Active unit has finished playing their attack animation
                        } else if((this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack1 || this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit1) && this.attackQueue[0].currentAnim.loopCount >= 1) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.idle; // Prepare active unit animation for possible second attack
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.idle; // Prepare target unit animation for possible second attack

                            // Determine next stage of battle animation sequence
                            if(this.battleAnimStats.targetedUnit.health > 0)
                                this.attackQueueIndex = 1; // Target unit is still alive; target unit's turn to counterattack
                            else
                                this.attackQueueIndex = 3; // Target unit is not alive; end battle animation sequence
                        }
                    // Counterattack -------------------------------------------
                    } else if(this.attackQueueIndex === 1) {
                        // Target unit has not started their attack animation yet
                        if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.idle) {
                            // Compute if target unit triggers critical hit on active unit
                            if(this.computeBattleCritChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                // Play target unit's critical attack animation
                                this.attackQueue[1].currentAnim = this.attackQueue[1].anims.crit0;
                                this.attackQueue[1].currentAnim.rewind();
                            // No critical hit triggered --> Proceed to normal attack (compute hit/miss later)
                            } else {
                                // Play target unit's normal attack animation
                                this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack0;
                                this.attackQueue[1].currentAnim.rewind();
                            }
                        // Target unit is on the attack (normal or critical) frame where it is about to strike active unit
                        } else if((this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0 || this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit0) && this.attackQueue[1].currentAnim.loopCount >= 1) {
                            // Target unit is running critical hit animation
                            if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit0) {
                                // Continue running next set of critical hit animation
                                this.attackQueue[1].currentAnim = this.attackQueue[1].anims.crit1;
                                this.attackQueue[1].currentAnim.rewind();

                                // Compute if target unit's attack hit or missed
                                // Target unit's attack hit
                                if(this.computeBattleNormalHitChance(this.targetedUnit, this.units[this.activeUnit]) + this.weaponTriangle(this.targetedUnit, this.units[this.activeUnit]).a > Math.random() * 100) {
                                    console.log('Critical hit');

                                    this.screenshakeIntensity = 10;

                                    // Compute damage
                                    this.battleAnimStats.activeUnit.health -= this.computeBattleCritDamage(this.targetedUnit, this.units[this.activeUnit]);

                                    // Do post-damage health checks and clamp health to valid values
                                    if(this.battleAnimStats.activeUnit.health < 0)
                                        this.battleAnimStats.activeUnit.health = 0;
                                    else if(this.battleAnimStats.activeUnit.health > this.battleAnimStats.activeUnit.health_max)
                                        this.battleAnimStats.activeUnit.health = this.battleAnimStats.activeUnit.health_max;
                                // Target unit's attack missed
                                } else {
                                    console.log('Attack missed');

                                    // Play active unit's dodge animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.dodge;
                                    this.attackQueue[0].currentAnim.rewind();
                                }

                                // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                    this.units[this.activeUnit].item_uses[0]--;
                                    if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                        console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                        this.units[this.activeUnit].item[0] = null;
                                        this.units[this.activeUnit].item_uses[0] = 0;
                                    }
                                }
                            // Target unit is running normal hit animation
                            } else if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0) {
                                // Continue running next set of normal hit animation
                                this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack1;
                                this.attackQueue[1].currentAnim.rewind();

                                // Compute if target unit's attack hit or missed
                                // Target unit's attack hit
                                if(this.computeBattleNormalHitChance(this.units[this.activeUnit],this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                    console.log('Normal hit');

                                    this.screenshakeIntensity = 5;

                                    // Compute damage
                                    this.battleAnimStats.activeUnit.health -= this.computeBattleNormalDamage(this.targetedUnit, this.units[this.activeUnit]);

                                    // Do post-damage health checks and clamp health to valid values
                                    if(this.battleAnimStats.activeUnit.health < 0)
                                        this.battleAnimStats.activeUnit.health = 0;
                                    else if(this.battleAnimStats.activeUnit.health > this.battleAnimStats.activeUnit.health_max)
                                        this.battleAnimStats.activeUnit.health = this.battleAnimStats.activeUnit.health_max;
                                // Target unit's attack missed
                                } else {
                                    console.log('Attack missed');

                                    // Play active unit's dodge animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.dodge;
                                    this.attackQueue[0].currentAnim.rewind();
                                }

                                // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                    this.units[this.activeUnit].item_uses[0]--;
                                    if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                        console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                        this.units[this.activeUnit].item[0] = null;
                                        this.units[this.activeUnit].item_uses[0] = 0;
                                    }
                                }
                            }
                        // Target unit has finished playing their attack animation
                        } else if((this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack1 || this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit1) && this.attackQueue[1].currentAnim.loopCount >= 1) {
                            this.attackQueue[0].currentAnim = this.attackQueue[0].anims.idle; // Prepare active unit animation for possible second attack
                            this.attackQueue[1].currentAnim = this.attackQueue[1].anims.idle; // Prepare target unit animation for possible second attack

                            // Determine next stage of battle animation sequence
                            // Both units alive and there is still a unit remaining in the attack queue (second attack)
                            if(this.battleAnimStats.activeUnit.health > 0 && this.battleAnimStats.targetedUnit.health > 0 && this.attackQueue.length >= 3) {
                                // Prepare the unit animation for attack
                                this.attackQueue[2].currentAnim = this.attackQueue[2].anims.idle;
                                this.attackQueue[2].currentAnim.rewind();

                                this.attackQueueIndex = 2; // Unit's turn to perform second attack
                            // One of the units is defeated or there is no remaining units in the attack queue
                            } else
                                this.attackQueueIndex = 3; // End battle animation sequence

                        }
                    // Second attack -------------------------------------------
                    } else if(this.attackQueueIndex === 2) {
                        // Third unit in attack queue is active unit; active unit attacks second time
                        if(this.attackQueue[2] === this.attackQueue[0]) {
                            // Active unit has not started their attack animation yet
                            if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.idle) {
                                // Compute if active unit triggers critical hit on target unit
                                if(this.computeBattleCritChance(this.units[this.activeUnit], this.targetedUnit) > Math.random() * 100) {
                                    // Play active unit's critical attack animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.crit0;
                                    this.attackQueue[0].currentAnim.rewind();
                                // No critical hit triggered --> Proceed to normal attack (compute hit/miss later)
                                } else {
                                    // Play active unit's normal attack animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack0;
                                    this.attackQueue[0].currentAnim.rewind();
                                }
                            // Active unit is on the attack (normal or critical) frame where it is about to strike target unit
                            } else if((this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0 || this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit0) && this.attackQueue[0].currentAnim.loopCount >= 1) {
                                // Active unit is running critical hit animation
                                if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit0) {
                                    // Continue running next set of critical hit animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.crit1;
                                    this.attackQueue[0].currentAnim.rewind();

                                    // Compute if active unit's attack hit or missed
                                    // Active unit's attack hit
                                    if(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                        console.log('Critical hit');

                                        this.screenshakeIntensity = 10;

                                        // Compute damage
                                        this.battleAnimStats.targetedUnit.health -= this.computeBattleCritDamage(this.units[this.activeUnit], this.targetedUnit);

                                        // Do post-damage health checks and clamp health to valid values
                                        if(this.battleAnimStats.targetedUnit.health < 0)
                                            this.battleAnimStats.targetedUnit.health = 0;
                                        else if(this.battleAnimStats.targetedUnit.health > this.battleAnimStats.targetedUnit.health_max)
                                            this.battleAnimStats.targetedUnit.health = this.battleAnimStats.targetedUnit.health_max;
                                    // Active unit's attack missed
                                    } else {
                                        console.log('Attack missed');

                                        // Play target unit's dodge animation
                                        this.attackQueue[1].currentAnim = this.attackQueue[1].anims.dodge;
                                        this.attackQueue[1].currentAnim.rewind();
                                    }

                                    // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                    if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                        this.units[this.activeUnit].item_uses[0]--;
                                        if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                            console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                            this.units[this.activeUnit].item[0] = null;
                                            this.units[this.activeUnit].item_uses[0] = 0;
                                        }
                                    }
                                // Active unit is running normal hit animation
                                } else if(this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack0) {
                                    // Continue running next set of normal hit animation
                                    this.attackQueue[0].currentAnim = this.attackQueue[0].anims.attack1;
                                    this.attackQueue[0].currentAnim.rewind();

                                    // Battle animation screen effects
                                    if(this.battleAnimStats.activeUnit.item[0] === this.itemCatalog.tome1) {
                                        this.battleAnimControllers.effects.currentAnim = this.battleAnimControllers.effects.anims.fimbulvetr;
                                        this.battleAnimControllers.effects.currentAnim.rewind();
                                    } else if(this.battleAnimStats.activeUnit.item[0] === this.itemCatalog.tome3) {
                                        this.battleAnimControllers.effects.currentAnim = this.battleAnimControllers.effects.anims.excalibur;
                                        this.battleAnimControllers.effects.currentAnim.rewind();
                                    }

                                    // Compute if active unit's attack hit or missed
                                    // Active unit's attack hit
                                    if(this.computeBattleNormalHitChance(this.units[this.activeUnit],this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                        console.log('Normal hit');

                                        this.screenshakeIntensity = 5;

                                        // Compute damage
                                        this.battleAnimStats.targetedUnit.health -= this.computeBattleNormalDamage(this.units[this.activeUnit], this.targetedUnit);

                                        // Do post-damage health checks and clamp health to valid values
                                        if(this.battleAnimStats.targetedUnit.health < 0)
                                            this.battleAnimStats.targetedUnit.health = 0;
                                        else if(this.battleAnimStats.targetedUnit.health > this.battleAnimStats.targetedUnit.health_max)
                                            this.battleAnimStats.targetedUnit.health = this.battleAnimStats.targetedUnit.health_max;
                                    // Active unit's attack missed
                                    } else {
                                        console.log('Attack missed');

                                        // Play target unit's dodge animation
                                        this.attackQueue[1].currentAnim = this.attackQueue[1].anims.dodge;
                                        this.attackQueue[1].currentAnim.rewind();
                                    }

                                    // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                    if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                        this.units[this.activeUnit].item_uses[0]--;
                                        if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                            console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                            this.units[this.activeUnit].item[0] = null;
                                            this.units[this.activeUnit].item_uses[0] = 0;
                                        }
                                    }
                                }
                            // Active unit has finished playing their attack animation
                            } else if((this.attackQueue[0].currentAnim === this.attackQueue[0].anims.attack1 || this.attackQueue[0].currentAnim === this.attackQueue[0].anims.crit1) && this.attackQueue[0].currentAnim.loopCount >= 1)
                                this.attackQueueIndex = 3; // End battle animation sequence
                        // Third unit in attack queue is target unit; target unit attacks second time
                        } else if(this.attackQueue[2] === this.attackQueue[1]) {
                            // Target unit has not started their attack animation yet
                            if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.idle) {
                                // Compute if target unit triggers critical hit on active unit
                                if(this.computeBattleCritChance(this.targetedUnit, this.units[this.activeUnit]) > Math.random() * 100) {
                                    // Play target unit's critical attack animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.crit0;
                                    this.attackQueue[1].currentAnim.rewind();
                                // No critical hit triggered --> Proceed to normal attack (compute hit/miss later)
                                } else {
                                    // Play target unit's normal attack animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack0;
                                    this.attackQueue[1].currentAnim.rewind();
                                }
                            // Target unit is on the attack (normal or critical) frame where it is about to strike active unit
                            } else if((this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0 || this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit0) && this.attackQueue[1].currentAnim.loopCount >= 1) {
                                // Target unit is running critical hit animation
                                if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit0) {
                                    // Continue running next set of critical hit animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.crit1;
                                    this.attackQueue[1].currentAnim.rewind();

                                    // Compute if target unit's attack hit or missed
                                    // Target unit's attack hit
                                    if(this.computeBattleNormalHitChance(this.targetedUnit, this.units[this.activeUnit]) + this.weaponTriangle(this.targetedUnit, this.units[this.activeUnit]).a > Math.random() * 100) {
                                        console.log('Critical hit');

                                        this.screenshakeIntensity = 10;

                                        // Compute damage
                                        this.battleAnimStats.activeUnit.health -= this.computeBattleCritDamage(this.targetedUnit, this.units[this.activeUnit]);

                                        // Do post-damage health checks and clamp health to valid values
                                        if(this.battleAnimStats.activeUnit.health < 0)
                                            this.battleAnimStats.activeUnit.health = 0;
                                        else if(this.battleAnimStats.activeUnit.health > this.battleAnimStats.activeUnit.health_max)
                                            this.battleAnimStats.activeUnit.health = this.battleAnimStats.activeUnit.health_max;
                                    // Target unit's attack missed
                                    } else {
                                        console.log('Attack missed');

                                        // Play active unit's dodge animation
                                        this.attackQueue[0].currentAnim = this.attackQueue[0].anims.dodge;
                                        this.attackQueue[0].currentAnim.rewind();
                                    }

                                    // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                    if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                        this.units[this.activeUnit].item_uses[0]--;
                                        if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                            console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                            this.units[this.activeUnit].item[0] = null;
                                            this.units[this.activeUnit].item_uses[0] = 0;
                                        }
                                    }
                                // Target unit is running normal hit animation
                                } else if(this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack0) {
                                    // Continue running next set of normal hit animation
                                    this.attackQueue[1].currentAnim = this.attackQueue[1].anims.attack1;
                                    this.attackQueue[1].currentAnim.rewind();

                                    // Compute if target unit's attack hit or missed
                                    // Target unit's attack hit
                                    if(this.computeBattleNormalHitChance(this.units[this.activeUnit],this.targetedUnit) + this.weaponTriangle(this.units[this.activeUnit], this.targetedUnit).a > Math.random() * 100) {
                                        console.log('Normal hit');

                                        this.screenshakeIntensity = 5;

                                        // Compute damage
                                        this.battleAnimStats.activeUnit.health -= this.computeBattleNormalDamage(this.targetedUnit, this.units[this.activeUnit]);

                                        // Do post-damage health checks and clamp health to valid values
                                        if(this.battleAnimStats.activeUnit.health < 0)
                                            this.battleAnimStats.activeUnit.health = 0;
                                        else if(this.battleAnimStats.activeUnit.health > this.battleAnimStats.activeUnit.health_max)
                                            this.battleAnimStats.activeUnit.health = this.battleAnimStats.activeUnit.health_max;
                                    // Target unit's attack missed
                                    } else {
                                        console.log('Attack missed');

                                        // Play active unit's dodge animation
                                        this.attackQueue[0].currentAnim = this.attackQueue[0].anims.dodge;
                                        this.attackQueue[0].currentAnim.rewind();
                                    }

                                    // Decrement weapon's usage by 1 (auto-destroy item if 0 usage remaining)
                                    if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip') {
                                        this.units[this.activeUnit].item_uses[0]--;
                                        if(this.units[this.activeUnit].item_uses[0] <= 0) {
                                            console.log(this.units[this.activeUnit].item[0].name + ' has exhausted its uses.');
                                            this.units[this.activeUnit].item[0] = null;
                                            this.units[this.activeUnit].item_uses[0] = 0;
                                        }
                                    }
                                }
                            // Target unit has finished playing their attack animation
                            } else if((this.attackQueue[1].currentAnim === this.attackQueue[1].anims.attack1 || this.attackQueue[1].currentAnim === this.attackQueue[1].anims.crit1) && this.attackQueue[1].currentAnim.loopCount >= 1) {
                                this.attackQueueIndex = 3; // End battle animation sequence
                            }
                        }
                    // Post-battle computations --------------------------------
                    } else if(this.attackQueueIndex === 3) {
                        // Upon death, enemy's equipped item transferred to player inventory, provided slots are available
                        // Player unit is attacker; player unit defeated enemy unit
                        if(this.units[this.activeUnit].unitType === 'player' && this.targetedUnit.unitType === 'enemy' && this.battleAnimStats.targetedUnit.health <= 0) {
                            var slot = this.freeSlot(this.units[this.activeUnit]);
                            if(slot !== null) {
                                this.units[this.activeUnit].item[slot] = this.targetedUnit.item[0];
                                this.units[this.activeUnit].item_uses[slot] = this.targetedUnit.item[0].uses;
                                console.log(this.units[this.activeUnit].name + ' obtained ' + this.targetedUnit.item[0].name + '.');
                            } else {
                                console.log('Cannot obtain ' + this.targetedUnit.item[0].name + ', ' + this.units[this.activeUnit].name + '\'s inventory is full.');
                                // TODO: Allow unit the option to drop an item to free a slot to obtain the dropped item or choose not to obtain the dropped item at all
                            }
                        // Player unit is defending unit; player unit defeated enemy unit (via counter attack)
                        } else if(this.units[this.activeUnit].unitType === 'enemy' && this.targetedUnit.unitType === 'player' && this.battleAnimStats.activeUnit.health <= 0) {
                            var slot = this.freeSlot(this.targetedUnit);
                            if(slot !== null) {
                                this.targetedUnit.item[slot] = this.units[this.activeUnit].item[0];
                                this.targetedUnit.item_uses[slot] = this.units[this.activeUnit].item[0].uses;
                                console.log(this.targetedUnit.name + ' obtained ' + this.units[this.activeUnit].item[0].name + '.');
                            } else {
                                console.log('Cannot obtain ' + this.units[this.activeUnit].item[0].name + ', ' + this.targetedUnit.name + '\'s inventory is full.');
                                // TODO: Allow unit the option to drop an item to free a slot to obtain the dropped item or choose not to obtain the dropped item at all
                            }
                        }

                        // Handle experience gain and level up for player units
                        // Player unit is the attacking unit
                        if(this.units[this.activeUnit].unitType === 'player') {
                            // Enemy unit is the defending unit
                            if(this.targetedUnit.unitType === 'enemy') {
                                // Enemy unit was defeated; player unit gains full experience
                                if(this.battleAnimStats.targetedUnit.health <= 0) {
                                    this.units[this.activeUnit].exp_curr += this.computeExperience(this.units[this.activeUnit], this.targetedUnit, true);
                                    console.log(this.units[this.activeUnit].name + ' gained ' + this.computeExperience(this.units[this.activeUnit], this.targetedUnit, true) + ' exp and now has ' + this.units[this.activeUnit].exp_curr + ' exp for current level ' + this.units[this.activeUnit].level + '.');
                                // Enemy unit is still alive; player unit gains partial experience
                                } else {
                                    this.units[this.activeUnit].exp_curr += this.computeExperience(this.units[this.activeUnit], this.targetedUnit, false);
                                    console.log(this.units[this.activeUnit].name + ' gained ' + this.computeExperience(this.units[this.activeUnit], this.targetedUnit, false) + ' exp and now has ' + this.units[this.activeUnit].exp_curr + ' exp for current level ' + this.units[this.activeUnit].level + '.');
                                }
                            // Player unit is the defending/assisted unit
                            } //else if(this.targetedUnit.unitType === 'player') {
                                // TODO: Experience gain for player healing/assisting player units
                            //}
                        // Enemy unit is the attacking unit
                        } else if(this.units[this.activeUnit].unitType === 'enemy') {
                            // Player unit is the defending unit
                            if(this.targetedUnit.unitType === 'player') {
                                // Enemy unit was defeated (via counter attack); player unit gains full experience
                                if(this.battleAnimStats.activeUnit.health <= 0) {
                                    this.units[this.activeUnit].exp_curr += this.computeExperience(this.units[this.activeUnit], this.targetedUnit, true);
                                    console.log(this.units[this.activeUnit].name + ' gained ' + this.computeExperience(this.units[this.activeUnit], this.targetedUnit, true) + ' exp and now has ' + this.units[this.activeUnit].exp_curr + ' exp for current level ' + this.units[this.activeUnit].level + '.');
                                // Enemy unit is still alive; player gains minimal experience (for successfully defending)
                                } else {
                                    this.units[this.activeUnit].exp_curr += this.computeExperience(this.units[this.activeUnit], this.targetedUnit, false);
                                    console.log(this.units[this.activeUnit].name + ' gained ' + this.computeExperience(this.units[this.activeUnit], this.targetedUnit, false) + ' exp and now has ' + this.units[this.activeUnit].exp_curr + ' exp for current level ' + this.units[this.activeUnit].level + '.');
                                }
                            }
                        }

                        // Check if player unit gained enough experience to advance to next level
                        // Player unit is the attacking unit
                        if(this.units[this.activeUnit].unitType === 'player') {
                            if(this.units[this.activeUnit].level < 20 && this.units[this.activeUnit].exp_curr >= this.units[this.activeUnit].exp_levelUp) {
                                this.units[this.activeUnit].level++; // Increase level
                                this.units[this.activeUnit].levelUpStats(); // Increase stats
                                this.units[this.activeUnit].exp_curr -= this.units[this.activeUnit].exp_levelUp; // Subtract experience overflow from experience to level up.

                                console.log(this.units[this.activeUnit].name + ' has reached level ' + this.units[this.activeUnit].level + '!');
                                console.log(this.units[this.activeUnit].stat);
                            }
                        }

                        // Player unit is the defending/assisted unit
                        if(this.targetedUnit.unitType === 'player') {
                            if(this.targetedUnit.level < 20 && this.targetedUnit.exp_curr >= this.targetedUnit.exp_levelUp) {
                                this.targetedUnit.level++; // Increase level
                                this.targetedUnit.levelUpStats(); // Increase stats
                                this.targetedUnit.exp_curr -= this.targetedUnit.exp_levelUp; // Subtract experience overflow from experience to level up.

                                console.log(this.targetedUnit.name + ' has reached level ' + this.targetedUnit.level + '!');
                                console.log(this.targetedUnit.stat);
                            }
                        }

                        // Clean up and end battle animation sequence
                        this.battleState = 'battle_transitionOut';
                        this.fadeInFromBattleAnim();
                    }
                }
                // End battle animation sequence -----------------------------------------------------------------
            }

            // Menu escape and clicked unit deselection during player's turn
            if(ig.input.pressed('escape') || this.units[this.activeUnit].unitType !== 'player') {
                if(this.clickedUnit !== null && this.clickedUnit.unitType === 'player' && this.clickedUnit.vel.x === 0 && this.clickedUnit.vel.y === 0) {
                    // Reset inventory/equipment flags
                    this.clickedUnit.selectedItemIndex = null;
                    this.clickedUnit.selectedWeapon = null;
                    this.clickedUnit.isEquipping = false;

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

                    // Reset battle state and targets
                    this.battleState = null;
                    this.attackTargets = [];
                    this.assistTargets = [];
                }

                this.menuVisible = false;
                ig.global.killAllButtons(Button);
            }

            // Menu to prematurely end player's phase (end all player's unit turn)
            if(ig.input.state('rightClick') && !this.menuVisible && this.hoveredUnit == null && this.units[this.activeUnit].unitType === 'player' && this.units[this.activeUnit].vel.x === 0 && this.units[this.activeUnit].vel.y === 0) {
                this.menuVisible = true;
                this.spawnEntity(EntityButton_endturn, ig.input.mouse.x + this.screen.x, ig.input.mouse.y + this.screen.y);
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

        // Create fade effect to transition from battlefield to battle animation
        fadeInToBattleAnim: function() {
            this.screenFadeInToBattleAnim = new ig.ScreenFader({
                fade: 'in',
                speed: 4,
                delayBefore: 1,
                //delayAfter: 0.5,
                callback: function() {
                    this.battleState = 'battle_prepare';
                    this.fadeOutAfterEffect();
                    this.screenFadeInToBattleAnim = null;
                }
            });
        }, // End fadeInToBattleAnim method

        // Create fade effect to transition from battle animation to battlefield
        fadeInFromBattleAnim: function() {
            this.screenFadeInFromBattleAnim = new ig.ScreenFader({
                fade: 'in',
                speed: 4,
                delayBefore: 1.5,
                //delayAfter: 0.5,
                callback: function() {
                    this.units[this.activeUnit].receiveDamage(Math.abs(this.units[this.activeUnit].health - this.battleAnimStats.activeUnit.health), this.targetedUnit);
                    this.targetedUnit.receiveDamage(Math.abs(this.targetedUnit.health - this.battleAnimStats.targetedUnit.health), this.units[this.activeUnit]);

                    this.battleAnimControllers.gui.currentAnim = this.battleAnimControllers.gui.anims.none;
                    this.battleAnimControllers.effects.currentAnim = this.battleAnimControllers.effects.anims.none;
                    this.battleAnimControllers.terrains.currentAnim = this.battleAnimControllers.terrains.anims.none;
                    this.battleAnimControllers.background.currentAnim = this.battleAnimControllers.background.anims.none;

                    this.attackQueue[0].kill(); // Kill unit animation entity
                    this.attackQueue[1].kill();  // Kill unit animation entity
                    if(this.attackQueue.length === 3)
                        this.attackQueue[2].kill();  // Kill unit animation entity
                    this.attackQueue = []; // Reset attack queue
                    this.attackQueueIndex = 0; // Reset attack queue index

                    this.battleAnimStats.activeUnit = null;
                    this.battleAnimStats.targetedUnit = null;

                    if(this.battleState === 'battle_transitionOut')
                        this.battleState = null; // End battle animation (stop displaying screen text)

                    this.units[this.activeUnit].turnUsed = true; // End active unit's turn

                    this.fadeOutAfterEffect();
                    this.menuVisible = false;
                    this.screenFadeInFromBattleAnim = null;
                }
            });
        }, // End fadeInFromBattleAnim method

        fadeOutAfterEffect: function() {
            this.screenFadeOutAfterEffect = new ig.ScreenFader({
                fade: 'out',
                speed: 4,
                callback: function() {
                    this.screenFadeOutAfterEffect = null;
                }
            });
        }, // End fadeInToBattleAnim method

        // Compute Experience
        computeExperience: function(target, attacker, killed) {
        	return killed ? Math.floor((32 + target.level + attacker.level) / 2) : Math.floor((32 + target.level + attacker.level ) / 4);
        },

        // Method to compute an entity's stats in one go
        recomputeStats: function(entity) {
            // Error checking for units with no equipped items or invalid item type
            if(entity.item[0] !== null && entity.item[0].type === 'equip') {
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
        },

        // Compute weapon triangle bonuses/penalties
        weaponTriangle: function(attacker, defender) {
            // entity_a: The attacking entity
            // entity_b: The defending entity
            // Make sure both units first item is not null
            if(attacker.item[0] !== null && defender.item[0] !== null) {
                if(attacker.item[0].affinity === 'sword' && defender.item[0].affinity === 'axe') // Sword strong against Axe
                    return {a: attacker.mod.hit + 15, b: defender.mod.hit - 15};
                else if(attacker.item[0].affinity === 'sword' && defender.item[0].affinity === 'lance') // Sword weak against Lance
                    return {a: attacker.mod.hit - 15, b: defender.mod.hit + 15};
                else if(attacker.item[0].affinity === 'axe' && defender.item[0].affinity === 'lance') // Axe strong against Lance
                    return {a: attacker.mod.hit + 15, b: defender.mod.hit - 15};
                else if(attacker.item[0].affinity === 'axe' && defender.item[0].affinity === 'sword') // Axe weak against Sword
                    return {a: attacker.mod.hit - 15, b: defender.mod.hit + 15};
                else if(attacker.item[0].affinity === 'lance' && defender.item[0].affinity === 'sword') // Lance strong against Sword
                    return {a: attacker.mod.hit + 15, b: defender.mod.hit - 15 };
                else if(attacker.item[0].affinity === 'lance' && defender.item[0].affinity === 'axe') // Lance weak against Axe
                    return {a: attacker.mod.hit - 15, b: defender.mod.hit + 15};
                else
                    return {a: attacker.mod.hit + 0, b: defender.mod.hit + 0}; // Same or unrecognized weapon affinity
            } else
                return {a: attacker.mod.hit + 0, b: defender.mod.hit + 0}; // No weapon equipped
        },

        // Reordering items in a unit's inventory
        swapItems: function(entity, index_1, index_2) {
            var item_temp = entity.item[index_1];
            entity.item[index_1] = entity.item[index_2];
            entity.item[index_2] = item_temp;

            var uses_temp = entity.item_uses[index_1];
            entity.item_uses[index_1] = entity.item_uses[index_2];
            entity.item_uses[index_2] = uses_temp;

            console.log('Swapping Items');
        },

        // Trading items between two unit's unventory
        tradeItems: function(a, t, index_1, index_2) {
            // Swap inventory items
            var item_temp = a.item[index_1];
            a.item[index_1] = t.item[index_2];
            t.item[index_2] = item_temp;

            // Swap item usage
            var uses_temp = a.item_uses[index_1];
            a.item_uses[index_1] = t.item_uses[index_2];
            t.item_uses[index_2] = uses_temp;
        },

        // Get unit's first available free slot, if one exists
        freeSlot: function(entity) {
            for(var i = 0; i < entity.item.length; i++)
                if(entity.item[i] === null)
                    return i; // Found a free slot, return slot index

            return null; // No free slot found, return null
        },

        // Method to reset all of the values inside the mod property.
        clearMod: function(entity) {
            entity.mod.atk   = 0;
            entity.mod.hit   = 0;
            entity.mod.crit  = 0;
            entity.mod.wt    = 0;
            entity.mod.evade = 0;
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
            return this.terrain[this.backgroundMaps[0].data[tile_pos.y][tile_pos.x]];
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

            if(typeof this.getEntityByName('btn_item_a0') && this.battleState === 'trading'){
                var a = this.units[this.activeUnit];
                var t = this.targetedUnit;
                a.statMugshot.draw(160, 32);
                t.statMugshot.draw(400, 32);
            }


            if(this.units[this.activeUnit].selectedWeapon !== null && this.units[this.activeUnit].isEquipping) {
                this.weaponModal.draw(390, 350);

                var a = this.units[this.activeUnit];
                a.statMugshot.draw(410, 150);

                var atkChange = a.stat.str + a.selectedWeapon.atk;
                var hitChange = a.stat.hit + a.selectedWeapon.hit;
                var critChange = a.stat.crit + a.selectedWeapon.crit;
                var evadeChange = a.mod.evade;

                this.font20_black.draw('Affinity: ' + a.selectedWeapon.affinity, 510, 370, ig.Font.ALIGN.CENTER);

                // Draw stats for new weapon
                this.font20_black.draw('Atk:', 410, 403);
                if(atkChange > a.derived_stats.atk)
                    this.font16_green.draw(a.derived_stats.atk + '->' + atkChange, 450, 404);
                else if(atkChange < a.derived_stats.atk)
                    this.font16_red.draw(a.derived_stats.atk + '->' + atkChange, 450, 404);
                else
                    this.font16_default.draw(a.derived_stats.atk, 450, 404);

                this.font20_black.draw('Hit:', 410, 437);
                if(hitChange > a.derived_stats.hit_rate)
                    this.font16_green.draw(a.derived_stats.hit_rate + '->' + hitChange, 450, 438);
                else if(hitChange < a.derived_stats.hit_rate)
                    this.font16_red.draw(a.derived_stats.hit_rate + '->' + hitChange, 450, 438);
                else
                    this.font16_default.draw(a.derived_stats.hit_rate, 450, 438);

                this.font20_black.draw('Crit:', 530, 403);
                if(critChange > a.derived_stats.crit_rate)
                    this.font16_green.draw(a.derived_stats.crit_rate + '->' + critChange, 575, 404);
                else if(critChange < a.derived_stats.crit_rate)
                    this.font16_red.draw(a.derived_stats.crit_rate + '->' + critChange, 575, 404);
                else
                    this.font16_default.draw(a.derived_stats.crit_rate, 575, 404);

                this.font20_black.draw('Avo:', 530, 437);
                this.font16_default.draw(evadeChange, 575, 438);
            }

            // Draw small character modal, showing small sprite, HP and level.
            // Spawn this whenever the cursor is hovering on top of an entity.
            // Currently, we'll only focus on player modals.
            if(this.units[this.activeUnit].unitType === 'player' && this.battleState !== 'battle_start' && this.hoveredUnit !== null) {
                // Draw small status screen modal
                this.hpModal.draw(10, 405);
                this.font16_black.draw(this.hoveredUnit.name, 120, 418, ig.Font.ALIGN.CENTER);
                this.font16_black.draw('HP: ' + this.hoveredUnit.health + '/' + this.hoveredUnit.health_max, 85, 440);

                // Draw small character modal sprite
                // Bypass drawing character modal sprite if one does not exist (usually for enemy units)
                if(typeof this.hoveredUnit.modal !== 'undefined')
                    this.hoveredUnit.modal.draw(15, 408);
            }

            // Player unit's stat screen menu
            if(ig.input.state('rightClick') && !this.menuVisible && this.battleState !== 'battle_start' && this.hoveredUnit !== null) {
                var a = this.hoveredUnit;
                this.statScreen.draw(0, 0);
                a.statMugshot.draw(30, 40);
                this.font20_default.draw(a.name,       115, 258);
                this.font20_default.draw(a.level,      80,  377);
                this.font20_default.draw(a.health,     80,  430);
                this.font20_default.draw(a.health_max, 130, 430);
                this.font20_default.draw(a.stat.str,   350,  91);
                this.font20_default.draw(a.stat.mag,   350, 141);
                this.font20_default.draw(a.stat.def,   350, 186);
                this.font20_default.draw(a.stat.res,   350, 231);
                this.font20_default.draw(a.stat.spd,   350, 281);
                this.font20_default.draw(a.stat.luk,   350, 331);
            }

            // Draw the terrain modal on cursor hover over in "free moving state".
            // Spawn this whenever a unit is not selected by the cursor entity.
            if(this.units[this.activeUnit].unitType === 'player' && this.battleState !== 'battle_start' && this.clickedUnit === null && this.hoveredTerrain !== null) {
                this.terrainModal.draw(475, 395);
                this.font16_black.draw(this.hoveredTerrain.type,  555, 420, ig.Font.ALIGN.CENTER);
                this.font16_black.draw(this.hoveredTerrain.def,   565, 440                      );
                this.font16_black.draw(this.hoveredTerrain.avoid, 565, 453                      );
            }

            // Draw battle summery modal on cursor hover while selecting an enemy to attack
            if(this.battleState === 'attack' && this.units[this.activeUnit] === this.targetedUnit) {
                if(this.hoveredUnit !== null && this.attackTargets.length > 0) {
                    for(var i = 0; i < this.attackTargets.length; i++) {
                        if(this.hoveredUnit === this.attackTargets[i]) {
                            this.battleSummaryModal.draw(515, 5);

                            if(this.units[this.activeUnit].item[0] !== null && this.units[this.activeUnit].item[0].type === 'equip')
                                this.units[this.activeUnit].item[0].icon.draw(                                                         520,  10                      );
                            this.font16_default.draw(this.units[this.activeUnit].name,                                                 587,  20, ig.Font.ALIGN.CENTER);
                            this.font16_default.draw(this.units[this.activeUnit].health,                                               600,  52                      );
                            this.font16_default.draw(this.computeBattleNormalDamage(this.units[this.activeUnit], this.hoveredUnit),    600,  85                      );
                            this.font16_default.draw(this.computeBattleNormalHitChance(this.units[this.activeUnit], this.hoveredUnit) + this.weaponTriangle(this.units[this.activeUnit], this.hoveredUnit).a,
                                                                                                                                       600, 118                      );
                            this.font16_default.draw(this.computeBattleCritChance(this.hoveredUnit, this.units[this.activeUnit]),      600, 149                      );

                            this.font16_default.draw(this.hoveredUnit.health,                                                          549,  52, ig.Font.ALIGN.RIGHT );
                            this.font16_default.draw(this.computeBattleNormalDamage(this.hoveredUnit, this.units[this.activeUnit]),    549,  85, ig.Font.ALIGN.RIGHT );
                            this.font16_default.draw(this.computeBattleNormalHitChance(this.hoveredUnit, this.units[this.activeUnit]) + this.weaponTriangle(this.hoveredUnit, this.units[this.activeUnit]).a,
                                                                                                                                       549, 118, ig.Font.ALIGN.RIGHT );
                            this.font16_default.draw(this.computeBattleCritChance(this.units[this.activeUnit], this.hoveredUnit),      549, 149, ig.Font.ALIGN.RIGHT );
                            this.font16_default.draw(this.hoveredUnit.name,                                                            558, 183, ig.Font.ALIGN.CENTER);
                            if(this.hoveredUnit.item[0] !== null && this.hoveredUnit.item[0].type === 'equip') {
                                this.hoveredUnit.item[0].icon.draw(                                                                    598, 173                      );
                                this.font16_default.draw(this.hoveredUnit.item[0].name,                                                558, 213, ig.Font.ALIGN.CENTER);
                            }

                            break;
                        }
                    }
                }
            }

            // Battle animation overlay
            if((this.battleState === 'battle_start' || this.battleState === 'battle_transitionOut') && this.units[this.activeUnit] !== this.targetedUnit) {
                var a = this.battleAnimStats.activeUnit;
                var t = this.battleAnimStats.targetedUnit;

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

                // Active unit -------------------------------------------------
                this.font20_default.draw(a.name,                               a_overlayDetailPos[0].x, a_overlayDetailPos[0].y, a_overlayDetailPos[0].align);
                this.font20_default.draw(this.computeBattleNormalHitChance(a, t) + this.weaponTriangle(a, t).a,
                                                                               a_overlayDetailPos[1].x, a_overlayDetailPos[1].y, a_overlayDetailPos[1].align);
                this.font20_default.draw(this.computeBattleNormalDamage(a, t), a_overlayDetailPos[2].x, a_overlayDetailPos[2].y, a_overlayDetailPos[2].align);
                this.font20_default.draw(this.computeBattleCritChance(a, t),   a_overlayDetailPos[3].x, a_overlayDetailPos[3].y, a_overlayDetailPos[3].align);
                if(a.item[0] !== null && a.item[0].type === 'equip') {
                    a.item[0].icon.draw(                                       a_overlayDetailPos[4].x, a_overlayDetailPos[4].y                             );
                    this.font20_default.draw(a.item[0].name,                   a_overlayDetailPos[5].x, a_overlayDetailPos[5].y, a_overlayDetailPos[5].align);
                } else
                    this.font20_default.draw('----',                           a_overlayDetailPos[5].x, a_overlayDetailPos[5].y, a_overlayDetailPos[5].align);
                this.font20_default.draw(a.health,                             a_overlayDetailPos[6].x, a_overlayDetailPos[6].y, a_overlayDetailPos[6].align);

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
                this.font20_default.draw(t.name,                               t_overlayDetailPos[0].x, t_overlayDetailPos[0].y, t_overlayDetailPos[0].align);
                this.font20_default.draw(this.computeBattleNormalHitChance(t, a) + this.weaponTriangle(t, a).a,
                                                                               t_overlayDetailPos[1].x, t_overlayDetailPos[1].y, t_overlayDetailPos[1].align);
                this.font20_default.draw(this.computeBattleNormalDamage(t, a), t_overlayDetailPos[2].x, t_overlayDetailPos[2].y, t_overlayDetailPos[2].align);
                this.font20_default.draw(this.computeBattleCritChance(t, a),   t_overlayDetailPos[3].x, t_overlayDetailPos[3].y, t_overlayDetailPos[3].align);
                if(t.item[0] !== null && t.item[0].type === 'equip') {
                    t.item[0].icon.draw(                                       t_overlayDetailPos[4].x, t_overlayDetailPos[4].y                             );
                    this.font20_default.draw(t.item[0].name,                   t_overlayDetailPos[5].x, t_overlayDetailPos[5].y, t_overlayDetailPos[5].align);
                } else
                    this.font20_default.draw('----',                           t_overlayDetailPos[5].x, t_overlayDetailPos[5].y, t_overlayDetailPos[5].align);
                this.font20_default.draw(t.health,                             t_overlayDetailPos[6].x, t_overlayDetailPos[6].y, t_overlayDetailPos[6].align);

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
            if(this.screenFadeInToBattleAnim)
                this.screenFadeInToBattleAnim.draw();
            if(this.screenFadeInFromBattleAnim)
                this.screenFadeInFromBattleAnim.draw();
            if(this.screenFadeOutAfterEffect)
                this.screenFadeOutAfterEffect.draw();
        } // End draw method
    }); // End ig.BattleMode

    /**
     *  ig.StartScreen
     *  -----
     *  Displays the game start screen (seen immediately after the game loads).
     */
    /*ig.StartScreen = ig.BaseGame.extend({
        update: function() {
            this.parent();

            if(ig.input.pressed('leftClick'))
                ig.system.setGame(ig.BattleMode)
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
            var y = 0;
            this.font20_default.draw('Water Emblem', x, y + 160, ig.Font.ALIGN.CENTER);
            this.font16_default.draw('(In development)', x, y + 220, ig.Font.ALIGN.CENTER);
            this.font16_default.draw('Left click to start', x, y + 400, ig.Font.ALIGN.CENTER);
        } // End draw method
    }); // End ig.StartScreen
    */

    /**
     *  ig.GameOver
     *  -----
     *  Displays the game over screen when the main player has been defeated or
     *  has failed the primary battle objective.
     */
    ig.GameOver = ig.BaseGame.extend({
        update: function() {
            this.parent();

            if(ig.input.pressed('leftClick'))
                ig.system.setGame(ig.StartScreen)
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
            var y = 0;
            this.font20_default.draw('Game Over', x, y + 160, ig.Font.ALIGN.CENTER);
            this.font16_default.draw(ig.global.main_player_name + ' has been defeated.', x, y + 220, ig.Font.ALIGN.CENTER);
            this.font16_default.draw('Left click to start', x, y + 400, ig.Font.ALIGN.CENTER);
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
}

