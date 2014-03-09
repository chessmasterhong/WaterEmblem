/**
 *  dark_druid.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.dark_druid'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityDark_druid = ig.global.EntityBase_player.extend({
        name: 'Nergal',

        animSheet: new ig.AnimationSheet('media/units/players/newDarkDruid.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/nergal.png'),
        modal: new ig.Image('media/modal/nergal_modal.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 10;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
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
