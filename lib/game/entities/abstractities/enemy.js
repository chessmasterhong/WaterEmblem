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
.defines(function() { "use strict";
    ig.global.EntityBase_enemy = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 32, y: 32},

        maxVel: {x: 256, y: 256},
        speed: {x: 128, y: 128},

        dir: ['idle', 'up', 'down', 'left', 'right'],

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Create grid movement
            this.movement = new GridMovement(this);
            this.movement.speed = this.speed;
        },

        update: function() {
            this.parent();
            
            var move = this.dir[Math.floor(Math.random() * this.dir.length)];

            // Update grid movement
            this.movement.update();
            if(move === 'up')         this.movement.direction = GridMovement.moveType.UP;
            else if(move === 'down')  this.movement.direction = GridMovement.moveType.DOWN;
            else if(move === 'left')  this.movement.direction = GridMovement.moveType.LEFT;
            else if(move === 'right') this.movement.direction = GridMovement.moveType.RIGHT;
        },

        check: function(other) {
            this.parent(other);

            // Grid movement collision check
            other.movement.collision();

            if(other instanceof EntityPlayer) {
                this.receiveDamage(1);
                console.log(this.name + ': health = ' + this.health);
            }
        }
    })
});
