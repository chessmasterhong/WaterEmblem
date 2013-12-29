/*******************************************************************************
  main.js
  -----
  Contains the core logic for the game.
*******************************************************************************/

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
    'impact.debug.debug',

    // Player, PCs, NPCs, Enemies
    'game.entities.player',
    'game.entities.enemies.practice_dummy',

    // Objects
    'game.entities.misc.exit',

    // Levels
    'game.levels.demo',
    'game.levels.demo2',
    'game.levels.battlefield',

    // Plugins
    'plugins.director.director',
    'plugins.screen-fader.screen-fader'
)
.defines(function() {
    /**
    BaseGame
    -----
    Contains the shared properties and actions from which the core game states
    are derived from.
    **/
    BaseGame = ig.Game.extend({
        font: new ig.Font('media/arial14.font.png'),

        init: function() {
            // Bind keys to game actions
            ig.input.bind(ig.KEY.UP_ARROW,    'up'   ); // Up Arrow
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down' ); // Down Arrow
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left' ); // Left Arrow
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right'); // Right Arrow
        }
    });

    /**
    MainGame
    -----
    Displays the main game screen with a top-down perspective centered on the
    player. The player is allowed to navigate and interact in the game using a
    4-directional "grid-like" movement system.
    **/
    MainGame = BaseGame.extend({
        levelVars: [LevelDemo, LevelDemo2],

        init: function() {
            this.parent();

            this.director = new ig.Director(this, this.levelVars);

            // Load map
            if(ig.global.game_pos.map !== null) {
                //console.log('Map defined at map ' + ig.global.game_pos.map);
                this.director.loadLevel(ig.global.game_pos.map);
            } else {
                //console.log('No map defined. Using first map.');
                this.director.firstLevel();
            }

            player = this.getEntitiesByType(EntityPlayer)[0];

            // Move player to last world position (if exists)
            if(ig.global.game_pos.x !== null && ig.global.game_pos.y !== null) {
                //console.log('Player position defined at (x: ' + ig.global.game_pos.x + ', y: ' + ig.global.game_pos.y + ')');
                player.pos = {x: ig.global.game_pos.x, y: ig.global.game_pos.y};
            }
        },

        update: function() {
            this.parent();

            // Make screen follow player
            player && (this.screen.x = player.pos.x - ig.system.width * 0.5,
                       this.screen.y = player.pos.y - ig.system.height * 0.5);
        },
    });

    /**
    BattleMode
    -----
    Displays the battlefield with a top-down persoective centered on the current
    active unit. The player's party, enemy's party/units, and assistive or
    neutral party/units take turns on the battlefield.

    The player leaves battle mode and back onto the main game under the
    condition where either:
        1. All or specific enemies are defeated.
        2. Every member in the player's party is defeated.
        3. Some special condition is triggered (i.e., after a certain number of
           turns has elapsed, or the health of a specific unit reached below a
           certain amount, etc.).
    **/
    BattleMode = BaseGame.extend({
        //levelVars: [LevelBattlefield],

        init: function() {
            this.parent();

            // Load battlefield map
            this.loadLevel(LevelBattlefield);

            this.screenFader = new ig.ScreenFader({
                fade: 'out',
                speed: 2,
                //delayAfter: 1,
            });

            console.log('Player position stored at: (map: ' + ig.global.game_pos.map + ', x: ' + ig.global.game_pos.x + ', y: ' + ig.global.game_pos.y + ')');
            console.log('Enter battle mode!');

            // Determine number of enemies to spawn
            var num_of_enemies_range = {min: 2, max: 4};
            num_of_enemies = Math.floor(Math.random() * (num_of_enemies_range.max - num_of_enemies_range.min + 1)) + num_of_enemies_range.min;

            // Determine position range on battlefield to spawn enemy
            tilesize = this.collisionMap.tilesize;
            var t = tilesize * 0.5;
            mapsize = {x: this.collisionMap.width * tilesize, y: this.collisionMap.height * tilesize};
            var pos_of_enemies_range = {min: {x: tilesize, y: tilesize},
                                        max: {x: mapsize.x * 0.5 - tilesize, y: mapsize.y - tilesize * 2}};

            // Generate enemies
            enemies = this.generateEnemies(num_of_enemies, pos_of_enemies_range.min.x, pos_of_enemies_range.max.x, pos_of_enemies_range.min.y, pos_of_enemies_range.max.y);
            console.log('Generating ' + num_of_enemies + ' enemies...');
            //console.log(enemies);

            // Spawn enemy units on battlefield
            enemy = [];
            for(var e = 0; e < num_of_enemies; e++) {
                enemy[e] = this.spawnEntity(enemies[e].entity_name, enemies[e].pos.x, enemies[e].pos.y);
                console.log(enemies[e].entity_name + ' spawned at (' + enemy[e].pos.x + ', ' + enemy[e].pos.y + ')')
            }
            
            // Spawn player's party on battlefield
            player = this.spawnEntity(EntityPlayer,
                mapsize.x * 0.75 + t - (mapsize.x * 0.75 + t) % tilesize + tilesize, // 3/4 map width + horizontal offset
                mapsize.y * 0.5  + t - (mapsize.y * 0.5  + t) % tilesize - tilesize // map height center
            );
        },

        update: function() {
            this.parent();
            
            // Player is at edge of battlefield --> flee the battle
            if(player.pos.x === 0 || player.pos.x === mapsize.x - tilesize ||
               player.pos.y === 0 || player.pos.y === mapsize.y - tilesize) {
                ig.system.setGame(MainGame);
                player.pos = {x: ig.global.game_pos.x, y: ig.global.game_pos.y};
            }
        },

        draw: function() {
            this.parent();
            if(this.screenFader) {
               this.screenFader.draw();
            }
        },

        generateEnemies: function(num_of_enemies, pos_of_enemies_range_min_x, pos_of_enemies_range_max_x, pos_of_enemies_range_min_y, pos_of_enemies_range_max_y) {
            // Store enumeration of all possible enemies grouped by encounter zones
            var enemy_groups_all = [
                ['EntityPractice_dummy', 'EntityPractice_dummy', 'EntityPractice_dummy', 'EntityPractice_dummy'],
                ['Enemy10', 'Enemy11'],
                ['Enemy20', 'Enemy21', 'Enemy22', 'Enemy23', 'Enemy24', 'Enemy25']
            ];

            // Determine the enemy group to use based on encounter zone
            var enemy_groups = enemy_groups_all[ig.global.encounter_zone];
            var enemy_groups_size = enemy_groups.length;

            // Get map's tile size
            var tilesize = this.collisionMap.tilesize;
            var t = tilesize * 0.5;

            // Create enemies
            var enemies = [];
            for(var e = 0; e < num_of_enemies; e++) {
                // Randomize spawn position
                p = {x: pos_of_enemies_range_min_x + Math.floor(Math.random() * (pos_of_enemies_range_max_x - pos_of_enemies_range_min_x)),
                     y: pos_of_enemies_range_min_y + Math.floor(Math.random() * (pos_of_enemies_range_max_y - pos_of_enemies_range_min_y))};
            
                // Push into enemies array the enemy's essential (dynamic) properties for duration of this battle
                enemies[e] = {
                    entity_name: enemy_groups[Math.floor(Math.random() * enemy_groups_size)], // Select a random enemy from the encounter zone enemies
                    pos: {x: p.x + t - (p.x + t) % tilesize, y: p.y + t - (p.y + t) % tilesize}, // Round spawn position to nearest multiple of tile size
                };
            }

            return enemies;
        }
    });

    /**
    GameOver
    -----
    Displays the game over screen when the player's party has been defeated in
    special encounters indicating the premature completion of the game.

    Generally, when the party is defeated and was not scripted to do so, the
    party would respawn at the last registered checkpoint. However, under
    special encounters (e.g., unescapable zones, important battles, etc.), the
    player should not be allowed to escape when defeated (since that may break
    the order of the game). Thus, the display of the game over screen is used
    under such scenarios.
    **/
    GameOver = ig.Game.extend({
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
            this.gameTextTitle.draw('Game Over', mid.x, mid.y-80, ig.Font.ALIGN.CENTER);
            this.gameText.draw('Your party has been defeated.', mid.x, mid.y, ig.Font.ALIGN.CENTER);
            this.gameText.draw('Press spacebar to continue.', mid.x, ig.system.height-40, ig.Font.ALIGN.CENTER);
        }
    });

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in MyGame state
    //   with 60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', MainGame, 60, 640, 480, 1);
});
