/**
 *  female_mage.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.female_mage'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityFemale_mage = ig.global.EntityBase_player.extend({
        name: 'Nino',
        statMugshot: new ig.Image('media/mugshots/players/nino.png'),
        modal: new ig.Image('media/modal/nino_modal.png'),
        // Level up percentages
        levelUpStatPercentage: {
            atk: 0.0,
            mag: 0.5,
            skl: 0.55,
            def: 0.15,
            res: 0.5,
            spd: 0.6,
            luk: 0.45
        },

        animSheet: new ig.AnimationSheet('media/units/players/newFemaleMage.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 19;
            this.health = 19;
            this.stat.atk = 7;
            this.stat.skl = 8;
            this.stat.mag = 7;
            this.stat.def = 4;
            this.stat.res = 7;
            this.stat.spd = 11;
            this.stat.luk = 10;
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
