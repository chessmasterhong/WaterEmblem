ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.debug.debug',
    'game.entities.player',
    'game.levels.demo',
    'plugins.director.director'
)
.defines(function() {
    MyGame = ig.Game.extend({
        font: new ig.Font('media/04b03.font.png'),

        init: function() {
            // Bind keys to game actions
            ig.input.bind(ig.KEY.UP_ARROW,    'up'   );
            ig.input.bind(ig.KEY.DOWN_ARROW,  'down' );
            ig.input.bind(ig.KEY.LEFT_ARROW,  'left' );
            ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');

            // Load map
            this.loadLevel(LevelDemo);
        },

        update: function() {
            this.parent();
            var player = this.getEntitiesByType(EntityPlayer)[0];
            
            // Make screen follow player
            player && (this.screen.x = player.pos.x - ig.system.width/2,
                       this.screen.y = player.pos.y - ig.system.height/2);
        },
    });

    // Display game screen
    ig.main('#canvas', MyGame, 60, 640, 480, 1);
});
