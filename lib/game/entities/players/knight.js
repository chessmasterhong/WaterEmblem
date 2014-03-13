/**
 *  knight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.knight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityKnight = ig.global.EntityBase_player.extend({
        name: 'Wallace',

        animSheet: new ig.AnimationSheet('media/units/players/knight.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/wallace.png'),
        modal: new ig.Image('media/modal/wallace_modal.png'),

        levelUpStatPercentage: {
            atk: 0.45,
            mag: 0.0,
            skl: 0.4,
            def: 0.55,
            res: 0.35,
            spd: 0.2,
            luk: 0.35
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 19;
            this.health = 19;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
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
