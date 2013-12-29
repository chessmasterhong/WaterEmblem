/*******************************************************************************
  dummy_target.js
  -----
  A simple "punching bag enemy".
*******************************************************************************/

ig.module(
    'game.entities.enemies.practice_dummy'
)
.requires(
    'game.entities.enemies.base_enemy'
)
.defines(function() {
    EntityPractice_dummy = EntityBase_enemy.extend({
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [1]);
        },

        check: function(other) {
            this.parent(other);
        }
    })
});
