/**
 *  troubadour.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.troubadour'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityTroubadour = ig.global.EntityBase_player.extend({
        name: 'Priscilla',

        animSheet: new ig.AnimationSheet('media/units/players/troubadour.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/priscilla.png'),
        modal: new ig.Image('media/modal/priscilla_modal.png'),

        levelUpStatPercentage: {
            atk: 0.0,
            mag: 0.7,
            skl: 0.5,
            def: 0.25,
            res: 0.25,
            spd: 0.6,
            luk: 0.8
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 10;
            this.health = 10;
            this.stat.atk = 0;
            this.stat.mag = 5;
            this.stat.skl = 5;
            this.stat.def = 2;
            this.stat.res = 2;
            this.stat.spd = 6;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Items
            //this.item[0] = null;
            //this.item[1] = null;
            //this.item[2] = null;
            //this.item[3] = null;
            //this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

            // Animation states
            this.addAnim('idle', 0.28, [0, 6, 12]);
            this.addAnim('left', 0.28, [1, 7, 13, 19]);
            this.addAnim('right', 0.28, [2, 8, 14, 20]);
            this.addAnim('down', 0.28, [3, 9, 15, 21]);
            this.addAnim('up', 0.28, [4, 10, 16, 22]);
            this.addAnim('attack', 0.28, [5, 11]);
        }
    })
});
