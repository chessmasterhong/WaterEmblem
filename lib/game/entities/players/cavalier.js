/**
 *  cavalier.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.cavalier'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityCavalier = ig.global.EntityBase_player.extend({
        name: 'Sain',
        // Level up percentages
        levelUpStatPercentage: {
            atk: 0.6,
            mag: 0.6,
            skl: 0.35,
            def: 0.2,
            res: 0.2,
            spd: 0.4,
            luk: 0.35
        },

        animSheet: new ig.AnimationSheet('media/units/players/cavalier.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/sain.png'),
        modal: new ig.Image('media/modal/sain_modal.png'),


        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 19;
            this.health = 19;
            this.stat.atk = 8;
            this.stat.mag = 0;
            this.stat.skl = 4;
            this.stat.def = 6;
            this.stat.res = 0;
            this.stat.spd = 6;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13, 19]);
            this.addAnim('right', 0.28, [2, 8, 14, 20]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11, 17]);
        }
    })
});
