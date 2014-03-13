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

        animSheet: new ig.AnimationSheet('media/units/players/cavalier.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/sain.png'),
        modal: new ig.Image('media/modal/sain_modal.png'),

        levelUpStatPercentage: {
            atk: 0.6,
            mag: 0.6,
            skl: 0.35,
            def: 0.2,
            res: 0.2,
            spd: 0.4,
            luk: 0.35
        },

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
