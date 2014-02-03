/**
 * main.js
 * -----
 * Contains the core logic for the game.
 */

//##############################################################################
//# Global variables                                                           #
//##############################################################################
ig.global.game_pos = {map: null, x: null, y: null};
ig.global.encounter_zone = 0;
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
    'game.entities.players.hero',

    // Generators and Objects
    'game.entities.misc.enemy_spawner',

    // Levels
    'game.levels.demo',
    'game.levels.demo2',
    'game.levels.battlefield',

    // Plugins
    'plugins.astar.astar-for-entities',
    'plugins.astar.astar-for-entities-debug', // <-- DEVELOPMENT DEBUG ONLY
    'plugins.director.director',
    'plugins.screen-fader.screen-fader'
)
.defines(function() {
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
            // Directional movement and menu navigation
            ig.input.bind(ig.KEY.UP_ARROW, 'up'); // Up Arrow
            ig.input.bind(ig.KEY.DOWN_ARROW, 'down'); // Down Arrow
            ig.input.bind(ig.KEY.LEFT_ARROW, 'left'); // Left Arrow
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right'); // Right Arrow
            ig.input.bind(ig.KEY.W, 'up'); // W
            ig.input.bind(ig.KEY.S, 'down'); // S
            ig.input.bind(ig.KEY.A, 'left'); // A
            ig.input.bind(ig.KEY.D, 'right'); // D

            // Modifier keys
            ig.input.bind(ig.KEY.SHIFT , 'SHIFT'); // Left/Right Shift
            //ig.input.bind(ig.KEY.CTRL ,  'CTRL' ); // Left/Right Control
        }
    });

    /**
     * ig.MainGame
     * -----
     * Displays the main game screen with a top-down perspective centered on the
     * player. The player is allowed to navigate and interact in the game using
     * a 4-directional "grid-like" movement system.
     */
    ig.MainGame = ig.BaseGame.extend({
        levelVars: [LevelDemo, LevelDemo2],

        init: function() {
            this.parent();

            // Load appropriate map
            this.director = new ig.Director(this, this.levelVars);
            if(ig.global.game_pos.map !== null)
                this.director.loadLevel(ig.global.game_pos.map);
            else
                this.director.firstLevel();

            // Move player to last world position (if exists)
            if(ig.global.game_pos.x !== null && ig.global.game_pos.y !== null)
                this.spawnEntity(EntityHero, ig.global.game_pos.x, ig.global.game_pos.y);
            else
                this.spawnEntity(EntityHero, 64, 64);

            this.screenFadeOut = new ig.ScreenFader({
                fade: 'out',
                speed: 4,
                //delayAfter: 1,
            });
        }, // End init method

        update: function() {
            this.parent();

            // Make screen follow player
            var player = ig.game.getEntityByName('player');
            player && (this.screen.x = player.pos.x - ig.system.width  * 0.5,
                       this.screen.y = player.pos.y - ig.system.height * 0.5);
        }, // End update method

        draw: function() {
            this.parent();
            if(this.screenFadeOut)
                this.screenFadeOut.draw();
        }, // End draw method
    });

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
        //levelVars: [LevelBattlefield],

        init: function() {
            this.parent();

            // Load battlefield map
            this.loadLevel(LevelBattlefield);

            this.screenFadeOut = new ig.ScreenFader({
                fade: 'out',
                speed: 4,
                //delayAfter: 1,
            });

            console.log('Player position stored at: (map: ' + ig.global.game_pos.map + ', x: ' + ig.global.game_pos.x + ', y: ' + ig.global.game_pos.y + ')');
            console.log('Enter battle mode!');

            // Determine number of enemies to spawn
            var num_of_enemies_range = {min: 2, max: 4};
            //this.num_of_enemies = Math.floor(Math.random() * (num_of_enemies_range.max - num_of_enemies_range.min + 1)) + num_of_enemies_range.min;

            // Determine position range on battlefield to spawn enemy
            var t = ig.global.tilesize * 0.5;
            this.mapsize = {x: this.collisionMap.width * ig.global.tilesize, y: this.collisionMap.height * ig.global.tilesize};

            // Generate, spawn enemies, and add enemies to total units in this battle
            var enemy_spawner = ig.game.getEntityByName('enemy_spawner');
            this.units = enemy_spawner.spawnEnemies(
                enemy_spawner.generateEnemies(
                    Math.floor(Math.random() * (num_of_enemies_range.max - num_of_enemies_range.min + 1)) + num_of_enemies_range.min
                )
            );

            // Spawn player's party on battlefield
            this.spawnEntity(
                EntityHero,
                this.mapsize.x * 0.75 + t - (this.mapsize.x * 0.75 + t) % ig.global.tilesize + ig.global.tilesize, // 3/4 map width + horizontal offset
                this.mapsize.y * 0.5  + t - (this.mapsize.y * 0.5  + t) % ig.global.tilesize - ig.global.tilesize  // map height center
            );

            // Add player and friendlies to total units in this battle
            this.units.push(ig.game.getEntityByName('player'));

            // Sort unit order by descending speed stat
            this.units.sort(
                function(unit_0, unit_1) {
                    return unit_1.stat_speed - unit_0.stat_speed;
                }
            );
            //console.log(this.units);

            console.log('Unit order sorted:')
            for(var e = 0; e < this.units.length; e++) {
                console.log(e + ' --> ' + this.units[e].name);
            }

            console.log('========== BEGIN BATTLE SEQUENCE ==========');
        }, // End init method

        update: function() {
            this.parent();

            // Handle unit movement order
            if(this.units[this.activeUnit].turnUsed) {
                this.activeUnit = (this.activeUnit + 1) % this.units.length;

                // DEBUG: used to check if activeUnit moved to next unit
                console.log('Active Unit: ' + this.activeUnit + ' (' + this.units[this.activeUnit].name + ')');
            }

            // Check how many units have moved for this turn
            var units_moved = 0;
            for(var e = 0; e < this.units.length; e++) {
                if(this.units[this.activeUnit].turnUsed)
                    units_moved++;
            }

            // If all units have moved for this turn, set all alive units to be able to move again
            if(units_moved === this.units.length) {
                for(var e = 0; e < this.units.length; e++) {
                    //console.log(this.units[e].name + ' --> ' + this.units[e].turnUsed);
                    if(!this.units[e]._killed) {
                        this.units[e].turnUsed = false;
                        this.units[e].stat_move_curr = 0;
                    }
                }
            }

            // Make screen follow player
            var player = ig.game.getEntityByName('player');
            player && (this.screen.x = player.pos.x - ig.system.width  * 0.5,
                       this.screen.y = player.pos.y - ig.system.height * 0.5);

            var enemy_count = 0;
            for(var e = 0; e < this.units.length; e++) {
                if(this.units[e].unitType === 'enemy') {
                    enemy_count++;
                    if(this.units[e]._killed)
                        enemy_count--;
                }
            }

            // Player is at edge of battlefield --> flee the battle
            if((player.pos.x === ig.global.tilesize || player.pos.x === this.mapsize.x - ig.global.tilesize * 2 ||
                 player.pos.y === ig.global.tilesize || player.pos.y === this.mapsize.y - ig.global.tilesize * 2 ||
                 enemy_count === 0) && !this.end_battle) {
                console.log('Leaving battle mode.');
                this.fadeIn();
                this.end_battle = true;
            // Stop player's movement, wait for fade transition to finish, and leave battlefield
            } else if(this.end_battle) {
                player.pos = ig.global.alignToGrid(player.pos.x, player.pos.y);
                player.vel = {x: 0, y: 0};
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
            if(this.screenFadeOut)
                this.screenFadeOut.draw();
            if(this.screenFadeIn)
                this.screenFadeIn.draw();
        } // End draw method
    });

    // IMPACTJS DEBUG SETTINGS OVERRIDE (for testing purposes only)
    ig.Entity._debugShowBoxes = true;
    ig.Entity._debugShowVelocities = true;
    ig.Entity._debugShowNames = true;

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in MyGame state
    //   with 60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', ig.MainGame, 60, 640, 480, 1);
});

//##############################################################################
//# Global functions                                                           #
//##############################################################################
/**
 * object ig.global.alignToGrid()
 * -----
 * Aligns the provided coordinates to the nearest grid tile. Used to reposition
 * entities back to grid in case they get knocked off alignment.
 *
 * Precondition:
 *     pos_x: The current or raw x-coordinate of the object.
 *     pos_y: The current or raw x-coordinate of the object.
 *
 * Postcondition:
 *     Returns an object of 2 properties {x: pos_x_aligned, y: pos_y_aligned},
 *     where pos_x_aligned and pos_y_aligned represents the aligned coordinates,
 *     respectively. If the entity or object uses the coordinates provided in
 *     the return value, it should align itself to the map rounded to the
 *     nearest multiple of ig.global.tilesize.
 */
ig.global.alignToGrid = function(pos_x, pos_y) {
    var t = ig.global.tilesize * 0.5;
    return {x: pos_x + t - (pos_x + t) % ig.global.tilesize, y: pos_y + t - (pos_y + t) % ig.global.tilesize};
};

/**
 * int ig.global.sgn(number)
 * -----
 * Sign function or signum function. Extracts the sign of a real number.
 *
 * Precondition:
 *     number: A real number to extract the sign from.
 *
 * Postcondition:
 *     Returns the sign of the number.
 *
 * Example:
 *     sgn(3.5) // 1
 *     sgn(-8)  // -1
 *     sgn(0)   // 0
 */
ig.global.sgn = function(number) {
    return (number > 0) - (number < 0);
};

