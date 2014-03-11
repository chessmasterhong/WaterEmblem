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
        name: 'Practice Dummy',

        animSheet: new ig.AnimationSheet('media/units/enemies/soldier.png', 32, 32),
        battleAnim: 'EntityEnemy_assassin_battleanim',

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 10;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 1;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Items
            this.item[0] = null;
            this.item[1] = null;
            this.item[2] = null;
            this.item[3] = null;
            this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [5, 6, 7, 8]);
            this.addAnim('down', 0.28, [10, 11, 12, 13]);
            this.addAnim('left', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('right', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('attack', 0.28, [15, 16]);
        }
    })
});
