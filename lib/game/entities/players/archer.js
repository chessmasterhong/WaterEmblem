/**
 *  archer.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.archer'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityArcher = ig.global.EntityBase_player.extend({
        name: 'Louisa',

        animSheet: new ig.AnimationSheet('media/units/players/archer.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/louisa.png'),
        modal: new ig.Image('media/modal/louisa_modal.png'),

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.4,
            skl: 0.5,
            def: 0.15,
            res: 0.3,
            spd: 0.6,
            luk: 0.5
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 17;
            this.health = 17;
            this.stat.atk = 4;
            this.stat.skl = 5;
            this.stat.mag = 0;
            this.stat.def = 3;
            this.stat.res = 1;
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
