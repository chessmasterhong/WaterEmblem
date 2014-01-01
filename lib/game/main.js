/**
 * main.js
 * -----
 * Contains the core logic for the game.
 */

// Global variables
ig.global.game_pos = {map: null, x: null, y: null};
ig.global.encounter_zone = 0;

ig.module(
    'game.main'
)
.requires(
    // ImpactJS Core
    'impact.game',
    'impact.font',
    'impact.debug.debug', // <-- DEVELOPMENT DEBUG ONLY

    // PCs and NPCs
    'game.entities.player',
    'game.entities.enemies.practice_dummy',

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
.defines(function() { "use strict";
    /**
     * ig.BaseGame
     * -----
     * Contains the shared properties and actions from which the core game
     * states are derived from.
     */
    ig.BaseGame = ig.Game.extend({
        font: new ig.Font('media/arial14.font.png'),

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
            //ig.input.bind(ig.KEY.SHIFT , 'SHIFT'); // Left/Right Shift
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

            this.director = new ig.Director(this, this.levelVars);

            // Load appropriate map
            this.director = new ig.Director(this, this.levelVars);
            if (ig.global.game_pos.map !== null)
                this.director.loadLevel(ig.global.game_pos.map);
            else
                this.director.firstLevel();

            // Move player to last world position (if exists)
            if (ig.global.game_pos.x !== null && ig.global.game_pos.y !== null)
                this.spawnEntity(EntityPlayer, ig.global.game_pos.x, ig.global.game_pos.y);
            else
                this.spawnEntity(EntityPlayer, 64, 64);

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
            if (this.screenFadeOut)
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
        num_of_enemies: null,
        tilesize: null,
        mapsize: null,
        end_battle: false,
        enemy: [],
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
            this.num_of_enemies = Math.floor(Math.random() * (num_of_enemies_range.max - num_of_enemies_range.min + 1)) + num_of_enemies_range.min;

            // Determine position range on battlefield to spawn enemy
            this.tilesize = this.collisionMap.tilesize;
            var t = this.tilesize * 0.5;
            this.mapsize = {x: this.collisionMap.width * this.tilesize, y: this.collisionMap.height * this.tilesize};

            // Generate and spawn enemies
            var enemy_spawner = ig.game.getEntityByName('enemy_spawner');
            this.enemy = enemy_spawner.spawnEnemies(enemy_spawner.generateEnemies(this.num_of_enemies));
            //console.log(this.enemy);

            // Spawn player's party on battlefield
            this.spawnEntity(
                EntityPlayer,
                this.mapsize.x * 0.75 + t - (this.mapsize.x * 0.75 + t) % this.tilesize + this.tilesize, // 3/4 map width + horizontal offset
                this.mapsize.y * 0.5 + t - (this.mapsize.y * 0.5 + t) % this.tilesize - this.tilesize // map height center
            );
        }, // End init method

        update: function() {
            this.parent();

            // Make screen follow player
            var player = ig.game.getEntityByName('player');
            player && (this.screen.x = player.pos.x - ig.system.width * 0.5,
                       this.screen.y = player.pos.y - ig.system.height * 0.5);

            var enemy_count = this.num_of_enemies;

            for (var e = 0; e < this.num_of_enemies; e++)
                if (this.enemy[e].health <= 0)
                    enemy_count--;

            // Player is at edge of battlefield --> flee the battle
            if ((player.pos.x === this.tilesize || player.pos.x === this.mapsize.x - this.tilesize * 2 ||
                 player.pos.y === this.tilesize || player.pos.y === this.mapsize.y - this.tilesize * 2 ||
                 enemy_count === 0) && !this.end_battle) {
                console.log('Leaving battle mode.');
                this.fadeIn();
                this.end_battle = true;
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
            if (this.screenFadeOut)
                this.screenFadeOut.draw();
            if (this.screenFadeIn)
                this.screenFadeIn.draw();
        } // End draw method
    });

    /**
     * ig.GameOver
     * -----
     * Displays the game over screen when the player's party has been defeated
     * in special encounters indicating the premature completion of the game.
     *
     * Generally, when the party is defeated and was not scripted to do so, the
     * party would respawn at the last registered checkpoint. However, under
     * special encounters (e.g., unescapable zones, important battles, etc.),
     * the player should not be allowed to escape when defeated (since that may
     * break the order of the game). Thus, the display of the game over screen
     * is used under such scenarios.
     */
    ig.GameOver = ig.Game.extend({
        gameTextTitle: new ig.Font('media/arial32.font.png'),
        gameText: new ig.Font('media/arial14.font.png'),

        init: function() {
            //ig.input.bind(ig.KEY.SPACE, 'start');
        },

        update: function() {
            //if(ig.input.pressed('start'))
            //ig.system.setGame(StartScreen)
            this.parent();
        },

        draw: function() {
            this.parent();
            var mid = {x: ig.system.width * 0.5, y: ig.system.height * 0.5};
            this.gameTextTitle.draw('Game Over', mid.x, mid.y - 80, ig.Font.ALIGN.CENTER);
            this.gameText.draw('Your party has been defeated.', mid.x, mid.y, ig.Font.ALIGN.CENTER);
            this.gameText.draw('Press spacebar to continue.', mid.x, ig.system.height - 40, ig.Font.ALIGN.CENTER);
        }
    });

    // IMPACTJS DEBUG SETTINGS OVERRIDE (for testing purposes only)
    ig.Entity._debugShowBoxes = true;
    ig.Entity._debugShowVelocities = true;
    ig.Entity._debugShowNames = true;
    ig.Entity._debugShowPaths = true;
    ig.Entity._debugShowWaypoints = true;

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in MyGame state
    //   with 60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', ig.MainGame, 60, 640, 480, 1);
});
