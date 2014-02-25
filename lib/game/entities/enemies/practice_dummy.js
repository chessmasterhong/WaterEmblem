/**
 *  dummy_target.js
 *  -----
 *  A simple "punching bag enemy".
 */

ig.module(
    'game.entities.enemies.practice_dummy'
)
.requires(
    'game.entities.abstractities.base_enemy'
)
.defines(function() {
    "use strict";

    ig.global.EntityPractice_dummy = ig.global.EntityBase_enemy.extend({
        animSheet: new ig.AnimationSheet('media/tilesets/enemies/soldier.png', 32, 32),

		//Enemy base stats
        stat: {
            atk: 4,
            mag: 5,
            def: 3,
            res: 5,
        },        

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [5, 6, 7, 8]);
            this.addAnim('down', 0.28, [10, 11, 12, 13]);
            this.addAnim('left', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('right', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('attack', 0.28, [15, 16]);
        }     
    })
});
