ig.global.playerWorldPos = {map: null, x: null, y: null};

ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.debug.debug',

    'game.entities.player',
    
    'game.entities.misc.exit',

    'game.levels.demo',
    'game.levels.demo2',
    'game.levels.battlefield',

    'plugins.director.director'
)
.defines(function() {
    MainGame = ig.Game.extend({
        font: new ig.Font('media/04b03.font.png'),

        levelVars: [LevelDemo, LevelDemo2],

        init: function() {
            // Bind keys to game actions
            ig.input.bind(ig.KEY.UP_ARROW,    'up'   );
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down' );
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left' );
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');

            // Load level
            this.director = new ig.Director(this, this.levelVars);

            if(ig.global.playerWorldPos.map !== null) {
                console.log('Map defined at map ' + ig.global.playerWorldPos.map);
                this.director.loadLevel(ig.global.playerWorldPos.map);
            } else {
                console.log('No map defined. Using first map.');
                this.director.firstLevel();
            }
            
            player = this.getEntitiesByType(EntityPlayer)[0];
            
            if(ig.global.playerWorldPos.x !== null && ig.global.playerWorldPos.y !== null) {
                console.log('Player position defined at (x: ' + ig.global.playerWorldPos.x + ', y: ' + ig.global.playerWorldPos.y + ')');
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

    CombatMode = ig.Game.extend({
        font: new ig.Font('media/04b03.font.png'),

        //levelVars: [LevelBattlefield],

        init: function() {
            // Bind keys to game actions
            ig.input.bind(ig.KEY.UP_ARROW,    'up'   );
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down' );
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left' );
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');

            // Load level
            //this.director = new ig.Director(this, this.levelVars);
            //this.director.firstLevel();
            this.loadLevel(LevelBattlefield);

            // Spawn player on battlefield
            player = this.spawnEntity(EntityPlayer, 480, 320);
            
            console.log('Enter combat mode!');
            console.log('Player last position stored at: (map: ' + ig.global.playerWorldPos.map + ', x: ' + ig.global.playerWorldPos.x + ', y: ' + ig.global.playerWorldPos.y + ')');
        },

        update: function() {
            this.parent();
            if(player.pos.x <= 100) {
                ig.system.setGame(MainGame);
                player.pos = {x: ig.global.playerWorldPos.x, y: ig.global.playerWorldPos.y};
            }
        },
    });

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in MyGame state
    //   with 60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', MainGame, 60, 640, 480, 1);
});
