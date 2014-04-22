/**
 *  enemy_thief_battleanim.js
 *  -----
 *  Unit animation for battle animation overlay.
 */

ig.module(
    'game.entities.animations.enemy_thief_battleanim'
)
.requires(
    'game.entities.abstractities.base_battleanim'
)
.defines(function() {
    "use strict";

    ig.global.EntityEnemy_thief_battleanim = ig.global.EntityBase_battleanim.extend({
        animSheet: new ig.AnimationSheet('media/units/animations/enemy_thief.png', 215, 108),

        attackSize:   {x: 215, y: 108},
        attackOffset: {x: 15, y: 0},
        critSize:     {x: 250, y: 150},
        critOffset:   {x: -25, y: -22},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.addAnim('idle', 1, [0], true);
            this.anims.dodge   = new ig.Animation(this.animSheet, 0.07, [0], true);
            this.anims.attack0 = new ig.Animation(this.animSheet, 0.08, [0, 1, 2, 3, 4, 5, 6, 7, 7, 7, 7, 7], true);
            this.anims.attack1 = new ig.Animation(this.animSheet, 0.08, [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22], true);
            this.anims.crit0   = new ig.Animation(this.animSheet, 0.07, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], true);
            this.anims.crit1   = new ig.Animation(this.animSheet, 0.07, [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], true);
        }
    });
});
