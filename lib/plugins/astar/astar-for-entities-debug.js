/*
 * astar-for-entities-debug
 * https://github.com/hurik/impact-astar-for-entities
 *
 * v1.4.2
 *
 * Andreas Giemza
 * andreas@giemza.net
 * http://www.andreasgiemza.de/
 *
 * This work is licensed under the Creative Commons Attribution 3.0 Unported License. To view a copy of this license, visit http://creativecommons.org/licenses/by/3.0/.
 *
 * It would be very nice when you inform me, with an short email, when you are using this plugin in a project.
 *
 * Thanks to: - Joncom (Deactivate diagonal movement)
 *            - FabienM (Heading Direction)
 *            - docmarionum1 (Teleportation bug)
 *            - tmfkmoney (Support for obsticles which are bigger than the tilesize)
 *            - chadrickm (Max movement)
 *
 * Based on : - https://gist.github.com/994534
 *            - http://www.policyalmanac.org/games/aStarTutorial_de.html
 *            - http://theory.stanford.edu/~amitp/GameProgramming/index.html
 */

ig.module(
    'plugins.astar.astar-for-entities-debug'
)
.requires(
    'impact.debug.menu',
    'impact.entity'
)
.defines(function() {

ig.Entity.inject({
    draw: function() {
        this.parent();

        if (ig.Entity._debugShowPaths && this.path) {
            // Code modified to fit grid-based movement
            var mapTilesize = ig.game.collisionMap.tilesize;

            ig.system.context.fillStyle = 'rgba(0, 0, 255, 0.25)';

            for (var i = 0; i < this.path.length; i++) {
                ig.system.context.beginPath();
                ig.system.context.rect(
                    this.path[i].x - ig.game.screen.x,
                    this.path[i].y - ig.game.screen.y,
                    mapTilesize,
                    mapTilesize
                );
                ig.system.context.closePath();
                ig.system.context.fill();
            }

            /*
            // Original code
            var mapTilesize = ig.game.collisionMap.tilesize;
            ig.system.context.strokeStyle = 'rgba(255,0,0,0.5)';
            ig.system.context.lineWidth = ig.system.scale;

            ig.system.context.beginPath();

            ig.system.context.moveTo(
            ig.system.getDrawPos(this.pos.x + this.size.x / 2 - ig.game.screen.x), ig.system.getDrawPos(this.pos.y + this.size.y / 2 - ig.game.screen.y));

            for (var i = 0; i < this.path.length; i++) {
                ig.system.context.lineTo(
                ig.system.getDrawPos(this.path[i].x + mapTilesize / 2 - ig.game.screen.x), ig.system.getDrawPos(this.path[i].y + mapTilesize / 2 - ig.game.screen.y));
            }

            ig.system.context.stroke();
            ig.system.context.closePath();
            */
        }

        if (ig.Entity._debugShowWaypoints && this.path) {
            for (var i = 0; i < this.path.length; i++) {
                this._drawCircle(this.path[i].x + ig.game.collisionMap.tilesize / 2,
                this.path[i].y + ig.game.collisionMap.tilesize / 2, 1, 2, 255, 0, 0, 0.5);
            }
        }
    },

    _drawCircle: function(x, y, radius, width, r, g, b, a) {
        ig.system.context.strokeStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        ig.system.context.lineWidth = width * ig.system.scale;

        ig.system.context.beginPath();
        ig.system.context.arc(ig.system.getDrawPos(x - ig.game.screen.x), ig.system.getDrawPos(y - ig.game.screen.y), radius * ig.system.scale, 0, Math.PI * 2);
        ig.system.context.stroke();
    }
});

ig.Entity._debugShowPaths = false;
ig.Entity._debugShowWaypoints = false;

ig.debug.addPanel({
    type: ig.DebugPanel,
    name: 'astar-for-entities-debug',
    label: 'A*',

    options: [{
        name: 'Show paths',
        object: ig.Entity,
        property: '_debugShowPaths'
    }, {
        name: 'Show waypoints',
        object: ig.Entity,
        property: '_debugShowWaypoints'
    }]
});

});