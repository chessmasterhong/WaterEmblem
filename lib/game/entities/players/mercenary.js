/**
 *  mercenary.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.mercenary'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityMercenary = ig.global.EntityBase_player.extend({
        name: 'Raven',

        animSheet: new ig.AnimationSheet('media/units/players/mercenary.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/raven.png'),
        modal: new ig.Image('media/modal/raven_modal.png'),

        levelUpStatPercentage: {
            atk: 0.55,
            mag: 0.0,
            skl: 0.4,
            def: 0.25,
            res: 0.15,
            spd: 0.45,
            luk: 0.4
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 18;
            this.health = 18;
            this.stat.atk = 7;
            this.stat.mag = 0;
            this.stat.def = 5;
            this.stat.res = 3;
            this.stat.spd = 7;
            this.stat.luk = 5;
            this.stat.mov = 4;

            // Items
            //this.item[0] = null;
            //this.item[1] = null;
            //this.item[2] = null;
            //this.item[3] = null;
            //this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

        }
    })
});
