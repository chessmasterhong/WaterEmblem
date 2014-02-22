/**
 *  main.js
 *  -----
 *  Contains the core logic for the game.
 */

//##############################################################################
//# Global variables                                                           #
//##############################################################################
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

    // PCs and NPCs
    'game.entities.players.hero', // Main character
    'game.entities.players.ally', // Player's party members

    // Generators and Objects
    'game.entities.misc.enemy_spawner', // Random enemy spawner entity
    'game.entities.misc.pointer', // Mouse cursor entity

    // Levels/Maps
    'game.levels.demo',
    'game.levels.battlefield',

    // Plugins
    'plugins.astar.astar-for-entities', // A* search algorithm for pathfinding
    //'plugins.astar.astar-for-entities-debug', // <-- DEVELOPMENT DEBUG ONLY
    'plugins.director.director', // Level transition abstraction
    'plugins.screen-fader.screen-fader', // Screen fade transition effect
    'plugins.button'
)
.defines(function() {
    // Enable ECMAScript 5 (JavaScript 1.8.5) Strict Mode
    //   http://developer.mozilla.org/en/JavaScript/Strict_mode
    //   http://impactjs.com/blog/2012/05/impact-1-20
    "use strict";

    /**
     * ig.BaseGame
     * -----
     * Contains the shared properties and actions from which the core game
     * states are derived from.
     */
    ig.BaseGame = ig.Game.extend({
        font: new ig.Font('media/arial.font_14.png'),

        init: function() {
            // Bind keys to game actions

            // Mouse buttons
            ig.input.bind(ig.KEY.MOUSE1,      'leftClick'); // Left Mouse Button: select option, interact with object/character, continue dialogue

            // Directional movement and menu navigation
            ig.input.bind(ig.KEY.UP_ARROW,    'up'    ); // Up Arrow: move player or navigation up
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down'  ); // Down Arrow: move player or nagivation down
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left'  ); // Left Arrow: move player or navigation left
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right' ); // Right Arrow: move player or navigation right
            ig.input.bind(ig.KEY.W,           'up'    ); // W: move player or navigation up
            ig.input.bind(ig.KEY.S,           'down'  ); // S: move player or navigation down
            ig.input.bind(ig.KEY.A,           'left'  ); // A: move player or navigation left
            ig.input.bind(ig.KEY.D,           'right' ); // D: move player or navigation right
            ig.input.bind(ig.KEY.ESC,         'escape'); // Escape: cancel option/selection, undo, etc.
            //ig.input.bind(ig.KEY.ENTER,       'select'); // Enter: select option, interact with object/character, continue dialogue, etc.
            ig.input.bind(ig.KEY.ENTER,       'menu'); 
            ig.input.bind( ig.KEY.MOUSE2,     'click' );

            // Modifier keys
            //ig.input.bind(ig.KEY.SHIFT,       'SHIFT' ); // Left/Right Shift
            //ig.input.bind(ig.KEY.CTRL ,       'CTRL' ); // Left/Right Control
        } // End init method
    }); // End ig.BaseGame

    /**
     * ig.MainGame
     * -----
     * Displays the main game screen with a top-down perspective centered on the
     * player. The player is allowed to navigate and interact in the game using
     * a 4-directional "grid-like" movement system.
     */
    ig.MainGame = ig.BaseGame.extend({
        player: null,
        levelVars: [LevelDemo],
        baseMenu: new ig.Image( 'media/menu.png' ),
        showingMenu: false,

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
                this.player = this.spawnEntity(EntityHero, 64, 64);

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

            if(ig.input.state('menu'))
            {
                if(this.showingMenu == false)
                    this.showingMenu = true;
                else
                    this.showingMenu = false;
            }

            if(this.showingMenu)
            {
               
                var x = ig.system.width/2;
                var y = ig.system.height/2;
                // this.baseMenu.draw(x, y);
                //this.font.draw('Item',  x + 45, y + 10 , ig.Font.ALIGN.CENTER);

                ig.game.spawnEntity( Button, 75, 65 ,{
                    font: new ig.Font('media/arial.font_14.png'),
                    text: [ 'Item' ],
                    textPos: { x: 37, y: 8 },
                    textAlign: ig.Font.ALIGN.CENTER,
                    size: { x: 75, y: 23 },
                    animSheet: new ig.AnimationSheet( 'media/button.png', 75, 23 ),
                    
                    pressedDown: function() {
                        console.log('Pressed Down');
                    },
                    pressed: function() {
                        console.log( 'pressed' );
                    },
                    pressedUp: function() {
                        console.log( 'pressedUp' );
                    }
                });

                ig.game.spawnEntity( Button, 75, 95 ,{
                    font: new ig.Font('media/arial.font_14.png'),
                    text: [ 'Unit' ],
                    textPos: { x: 37, y: 8 },
                    textAlign: ig.Font.ALIGN.CENTER,
                    size: { x: 75, y: 23 },
                    animSheet: new ig.AnimationSheet( 'media/button.png', 75, 23 ),
                    
                    pressedDown: function() {
                        console.log('Pressed Down');
                    },
                    pressed: function() {
                        console.log( 'pressed' );
                    },
                    pressedUp: function() {
                        console.log( 'pressedUp' );
                    }
                });
            }

            if(this.screenFadeOut)
                this.screenFadeOut.draw();
        }, // End draw method
    }); // End ig.MainGame

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
        mapsize: null,
        end_battle: false,
        units: [],
        activeUnit: 0,
        partyMembers: 2,

        //hoveredUnit: null,
        clickedUnit: null,

        //levelVars: [LevelBattlefield],

        init: function() {
            this.parent();

            // Load battlefield map
            this.loadLevel(LevelBattlefield);

            this.spawnEntity(EntityPointer, 0, 0);

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
            var enemy_spawner = ig.game.getEntityByName('enemy_spawner');
            this.units = enemy_spawner.spawnEnemies(enemy_spawner.generateEnemies(ig.global.encounter.spawn_min, ig.global.encounter.spawn_max));

            // Spawn player's party on battlefield
            var party = [];
            var mid = parseInt(this.partyMembers/2);

            // Spawn party leader (main character)
            party[0] = this.spawnEntity(
                EntityHero,
                Math.floor(this.mapsize.x * 0.75 / ig.global.tilesize) * ig.global.tilesize,
                Math.floor(this.mapsize.y * 0.5  / ig.global.tilesize) * ig.global.tilesize,
                {name: 'player_main'}
            );

            // Spawn party members (non-main character)
            for(var p = 1; p <= this.partyMembers; p++) {
                party[p] = this.spawnEntity(
                    EntityAlly,
                    Math.floor(this.mapsize.x * 0.8 / ig.global.tilesize) * ig.global.tilesize,
                    Math.floor(this.mapsize.y / (this.partyMembers + 1) * p / ig.global.tilesize) * ig.global.tilesize,
                    {name: 'player_' + p}
                );
            }

            // Add player and friendlies to total units in this battle
            this.units = this.units.concat(party);

            // Sort unit order by descending/reverse alphabetical order (order: player units -> enemy units -> ally units)
            this.units.sort(
                function(unit_0, unit_1) {
                    if(unit_0.unitType < unit_1.unitType)
                        return 1;
                    else if(unit_0.unitType > unit_1.unitType)
                        return -1;
                    else
                        return 0;
                }
            );
            console.log(this.units);

            console.log('Unit order sorted:')
            for(var e = 0; e < this.units.length; e++) {
                console.log(e + ' --> ' + this.units[e].name);
            }

            this.clickedUnit = this.units[0];

            console.log('========== BEGIN BATTLE SEQUENCE ==========');

            console.log('Active Unit: ' + this.activeUnit + ' (' + this.units[0].name + ')');
        }, // End init method

        update: function() {
            this.parent();

            // Handle unit movement order
            if(this.units[this.activeUnit].turnUsed) {
                this.activeUnit = (this.activeUnit + 1) % this.units.length;

                if(this.units[this.activeUnit].unitType === 'player')
                    this.clickedUnit = this.units[this.activeUnit];

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
                            this.units[u].stat_move_curr = 0;
                        }
                    }
                }

                // Check if there are any enemy units remaining on the battlefield
                var enemy_count = 0;
                for(var u = 0; u < this.units.length; u++) {
                    if(this.units[u].unitType === 'enemy') {
                        enemy_count++;
                        if(this.units[u]._killed)
                            enemy_count--;
                    }
                }
            }

            // If not player party's turn, deselect selected target
            if(ig.input.pressed('escape') || this.units[this.activeUnit].unitType !== 'player')
                this.clickedUnit = null;

            // Make screen follow active unit
            if(!this.units[this.activeUnit]._killed) {
                var unitFocus = this.units[this.activeUnit];
                unitFocus && (this.screen.x = unitFocus.pos.x - ig.system.width  * 0.5,
                              this.screen.y = unitFocus.pos.y - ig.system.height * 0.5);
            }

            // Player is at edge of battlefield --> flee the battle
            if(!this.end_battle && unitFocus.unitType === 'player' && (enemy_count === 0 ||
               unitFocus.pos.x === ig.global.tilesize || unitFocus.pos.x === this.mapsize.x - ig.global.tilesize * 2 ||
               unitFocus.pos.y === ig.global.tilesize || unitFocus.pos.y === this.mapsize.y - ig.global.tilesize * 2)) {
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

        draw: function() {
            this.parent();

            // Screen fade transition effect
            if(this.screenFadeOut)
                this.screenFadeOut.draw();
            if(this.screenFadeIn)
                this.screenFadeIn.draw();
        } // End draw method
    }); // End ig.BattleMode

    // IMPACTJS DEBUG SETTINGS OVERRIDE (for testing purposes only)
    //ig.Entity._debugShowBoxes = true;
    ig.Entity._debugShowVelocities = true;
    ig.Entity._debugShowNames = true;

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in ig.MainGame state with
    //   60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', ig.MainGame, 60, 640, 480, 1);
}); // End .defines

//##############################################################################
//# Global functions                                                           #
//##############################################################################
/**
 *  object ig.global.alignToGrid()
 *  -----
 *  Aligns the provided coordinates to the nearest grid tile. Used to reposition
 *  entities back to grid in case they get knocked off alignment.
 *
 *  Precondition:
 *      pos_x: The current or raw x-coordinate of the object.
 *      pos_y: The current or raw x-coordinate of the object.
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
    var t = ig.global.tilesize * 0.5;
    return {
        x: Math.floor((pos_x + t) / ig.global.tilesize) * ig.global.tilesize,
        y: Math.floor((pos_y + t) / ig.global.tilesize) * ig.global.tilesize
    };
};

/**
 *  int ig.global.sgn(number num)
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
ig.global.sgn = function(num) {
    return (num > 0) - (num < 0);
};

