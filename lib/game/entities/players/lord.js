/**
 *  lord.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.lord'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityLord = ig.global.EntityBase_player.extend({
        name: 'Roy',

        animSheet: new ig.AnimationSheet('media/units/players/roy.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/eliwood.png'),
        modal: new ig.Image('media/modal/eliwood_modal.png'),

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.0,
            skl: 0.5,
            def: 0.25,
            res: 0.3,
            spd: 0.4,
            luk: 0.6
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 18;
            this.health = 18;
            this.stat.atk = 5;
            this.stat.mag = 0;
            this.stat.skl = 5;
            this.stat.def = 5;
            this.stat.res = 0;
            this.stat.spd = 7;
            this.stat.luk = 7;
            this.stat.mov = 4;

            // Items
            //this.item[0] = null;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;

            this.derived_stats = ig.game.recomputeStats(this);

        }
    })
});
