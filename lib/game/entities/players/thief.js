/**
 *  thief.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.thief'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityThief = ig.global.EntityBase_player.extend({
        name: 'Matthew',

        animSheet: new ig.AnimationSheet('media/units/players/newThief.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/matthew.png'),
        modal: new ig.Image('media/modal/matthew_modal.png'),

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.0,
            skl: 0.5,
            def: 0.25,
            res: 0.15,
            spd: 0.9,
            luk: 0.5
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 11;
            this.health = 11;
            this.stat.atk = 5;
            this.stat.mag = 0;
            this.stat.skl = 5;
            this.stat.def = 4;
            this.stat.res = 1;
            this.stat.spd = 10;
            this.stat.luk = 6;
            this.stat.mov = 4;

            // Items
            //this.item[0] = null;
            //this.item[1] = null;
            //this.item[2] = null;
            //this.item[3] = null;
            //this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

            // Animation states
            this.addAnim('idle', 0.28, [15, 16, 17]);
            this.addAnim('left', 0.28, [0, 1, 2]);
            this.addAnim('right', 0.28, [22, 23, 24]);
            this.addAnim('down', 0.28, [10, 11, 12]);
            this.addAnim('up', 0.28, [5, 6, 7]);
            this.addAnim('attack', 0.28, [20, 21]);
        }
    })
});
