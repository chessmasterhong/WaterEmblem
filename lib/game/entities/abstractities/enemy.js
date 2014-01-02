/**
 * enemy.js
 * -----
 * Base enemy entity. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.enemy'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_enemy = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        size: {x: 32, y: 32},

        maxVel: {x: 256, y: 256},
        speed: 128,

        //dir: ['idle', 'up', 'down', 'left', 'right'],

        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        maxMovement: 31.9999, // If set to tile size, wierd stuff happens when pathfinding enemy aligns to target, so we set it very close to tile size.
        tilesize: 32,
        destination: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Create grid movement
            //this.movement = new GridMovement(this);
            //this.movement.speed = this.speed;

            this.pathTimer = new ig.Timer(1);
        },

        update: function() {
            this.parent();

            //var move = this.dir[Math.floor(Math.random() * this.dir.length)];

            var player = ig.game.getEntityByName('player');
            if(this.pathTimer.delta() > 0) {
                this.getPath(player.pos.x, player.pos.y, false);
                this.realignToGrid();
                this.pathTimer.reset();
            }

            this.followPath(this.speed, true);

            // Update grid movement
            //this.movement.update();
            //if(this.headingDirection === 4)      this.movement.direction = GridMovement.moveType.UP;
            //else if(this.headingDirection === 5) this.movement.direction = GridMovement.moveType.DOWN;
            //else if(this.headingDirection === 2) this.movement.direction = GridMovement.moveType.LEFT;
            //else if(this.headingDirection === 7) this.movement.direction = GridMovement.moveType.RIGHT;
        },

        realignToGrid: function() {
            this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y, this.tilesize);
            this.destination.x += ig.global.sgn(this.vel.x) * this.tilesize;
            this.destination.y += ig.global.sgn(this.vel.y) * this.tilesize;
            this.pos = this.destination;
            this.vel = {x: 0, y: 0};
        },

        check: function(other) {
            this.parent(other);

            // Realign back to grid on collision in case entity gets knocked off of grid
            this.realignToGrid();

            if(other instanceof EntityPlayer) {
                this.receiveDamage(1);
                console.log(this.name + ': health = ' + this.health);
            }
        }
    })
});
