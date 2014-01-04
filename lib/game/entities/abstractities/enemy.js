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
        unitType: 'enemy',

        // Collision types
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,

        // Collision box size
        size: {x: 32, y: 32},

        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        maxMovement: 31.9999, // If set to multiple of tile size, wierd stuff happens when pathfinding enemy aligns to target, so we set it very close to tile size.

        // Current and maximum movement speed
        maxVel: {x: 256, y: 256},
        speed: 128,

        stat_speed: 1,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.pathTimer = new ig.Timer(1);
        },

        update: function() {
            this.parent();

            var player = ig.game.getEntityByName('player');
            if(this.pathTimer.delta() > 1) {
                // Create and display path
                this.getPath(player.pos.x, player.pos.y, false);
                this.realignToGrid();
                this.pathTimer.reset();
            } else if(this.pathTimer.delta() > 0) {
                // Move along determined path
                this.followPath(this.speed, true);
            }
        },

        // Realigns an entity back to the grid (entity's position rounded to
        // nearest multiple of tile size). This is necessary since this entity
        // is not using the grid-based movement by default, so we create a
        // psuedo-grid-based movement by realigning the entity back to the grid
        // and only allow horizontal/vertical movements.
        realignToGrid: function() {
            this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y, ig.global.tilesize);
            this.pos.x += ig.global.sgn(this.vel.x) * ig.global.tilesize;
            this.pos.y += ig.global.sgn(this.vel.y) * ig.global.tilesize;
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
