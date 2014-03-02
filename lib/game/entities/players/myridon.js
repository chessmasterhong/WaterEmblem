/**
 *  myridon.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.myridon'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityMyridon = ig.global.EntityBase_player.extend({
        name: 'Guy',
        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.0,
            skl: 0.55,
            def: 0.25,
            res: 0.15,
            spd: 0.8,
            luk: 0.45
        },

        animSheet: new ig.AnimationSheet('media/units/players/myridon.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/guy.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 15;
            this.health = 15;
            this.stat.atk = 4;
            this.stat.skl = 3;
            this.stat.mag = 1;
            this.stat.def = 4;
            this.stat.res = 0;
            this.stat.spd = 11;
            this.stat.luk = 3;
            this.stat.mov = 4;

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('left', 0.28, [22, 23, 24]);
            this.addAnim('right', 0.28, [10, 11, 12, 20]);
            this.addAnim('down', 0.28, [5, 6, 7]);
            this.addAnim('up', 0.28, [15, 16, 17, 18]);
            this.addAnim('attack', 0.28, [20]);
        }
    })
});
