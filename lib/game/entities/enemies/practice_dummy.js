/**
 * dummy_target.js
 * -----
 * A simple "punching bag enemy".
 */

ig.module(
    'game.entities.enemies.practice_dummy'
)
.requires(
    'game.entities.abstractities.enemy'
)
.defines(function() { "use strict";
    ig.global.EntityPractice_dummy = ig.global.EntityBase_enemy.extend({
        animSheet: new ig.AnimationSheet('media/tilesheet.png', 32, 32),
        
        stat_speed: 1,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [1]);
        }
    })
});
