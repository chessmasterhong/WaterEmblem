/*******************************************************************************
  base_enemy.js
  -----
  Contains the shared enemies' properties and methods.
*******************************************************************************/

ig.module(
    'game.entities.enemies.base_enemy'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    EntityBase_enemy = ig.Entity.extend({
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.FIXED,

        size: {x: 32, y: 32},

        maxVel: {x: 256, y: 256},
        speed: {x: 128, y: 128},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.movement = new GridMovement(this);
            this.movement.speed = this.speed;
            move = null;
        },

        update: function() {
            this.parent();

            this.movement.update();
            if(move === 'up')         this.movement.direction = GridMovement.moveType.UP;
            else if(move === 'down')  this.movement.direction = GridMovement.moveType.DOWN;
            else if(move === 'left')  this.movement.direction = GridMovement.moveType.LEFT;
            else if(move === 'right') this.movement.direction = GridMovement.moveType.RIGHT;
        },

        check: function(other) {
            this.parent(other);

            other.movement.collision();

            if(other instanceof EntityPlayer) {
                this.receiveDamage(1);
                console.log(this.name + ': health = ' + this.health);
            }
        }
    })
});
