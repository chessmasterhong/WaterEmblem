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
            this.director.firstLevel();
        },

        update: function() {
            this.parent();
            var player = this.getEntitiesByType(EntityPlayer)[0];

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
            this.player = this.spawnEntity(EntityPlayer, 480, 320);
        },

        update: function() {
            this.parent();
        },
    });

    // Display game screen
    // Draw to HTML tag with id='canvas' and start game in MyGame state
    //   with 60 FPS, 640x480 resolution, and 1x scale ratio.
    ig.main('#canvas', MainGame, 60, 640, 480, 1);
});
