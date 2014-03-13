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

        animSheet: new ig.AnimationSheet('media/units/players/newMyrmidon.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/guy.png'),
        modal: new ig.Image('media/modal/guy_modal.png'),

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.0,
            skl: 0.55,
            def: 0.25,
            res: 0.15,
            spd: 0.8,
            luk: 0.45
        },

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
