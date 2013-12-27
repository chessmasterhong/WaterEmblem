/*******************************************************************************
  main.js
  -----
  Contains the core logic for the game.
*******************************************************************************/

ig.global.playerWorldPos = {map: null, x: null, y: null};

ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.debug.debug',

    'game.entities.player',
    
    'game.entities.enemies.practice_dummy',

    'game.entities.misc.exit',

    'game.levels.demo',
    'game.levels.demo2',
    'game.levels.battlefield',

    'plugins.director.director'
    //'plugins.screen-fader.screen-fader'
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
            if(ig.global.playerWorldPos.map !== null) {
                //console.log('Map defined at map ' + ig.global.playerWorldPos.map);
                this.director.loadLevel(ig.global.playerWorldPos.map);
            } else {
                //console.log('No map defined. Using first map.');
                this.director.firstLevel();
            }

            player = this.getEntitiesByType(EntityPlayer)[0];

            // Move player to last world position (if exists)
            if(ig.global.playerWorldPos.x !== null && ig.global.playerWorldPos.y !== null) {
                //console.log('Player position defined at (x: ' + ig.global.playerWorldPos.x + ', y: ' + ig.global.playerWorldPos.y + ')');
                player.pos = {x: ig.global.playerWorldPos.x, y: ig.global.playerWorldPos.y};
            }
        },

        update: function() {
            this.parent();

            // Make screen follow player
            player && (this.screen.x = player.pos.x - ig.system.width/2,
                       this.screen.y = player.pos.y - ig.system.height/2);
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

            // Spawn player's party on battlefield
            player = this.spawnEntity(EntityPlayer, 480, 320);
            
            // Spawn enemy units on battlefield
            enemy = this.spawnEntity(EntityPractice_dummy, 160, 160);

            //this.screenFader = new ig.ScreenFader({fade: 'out', speed: 2});

            console.log('Player position stored at: (map: ' + ig.global.playerWorldPos.map + ', x: ' + ig.global.playerWorldPos.x + ', y: ' + ig.global.playerWorldPos.y + ')');
            console.log('Enter battle mode!');
        },

        update: function() {
            this.parent();
            /*if(player.pos.x <= 100) {
                ig.system.setGame(MainGame);
                player.pos = {x: ig.global.playerWorldPos.x, y: ig.global.playerWorldPos.y};
            }*/
        },

        /*draw: function() {
            this.parent();
            if(this.screenFader) {
               this.screenFader.draw();
            }
        }*/
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
            var mid = {x: ig.system.width/2, y: ig.system.height/2};
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
