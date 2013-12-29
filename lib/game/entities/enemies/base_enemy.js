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

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.movement = new GridMovement(this);
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
