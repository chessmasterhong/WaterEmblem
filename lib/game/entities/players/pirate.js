/**
 *  pirate.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.pirate'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityPirate = ig.global.EntityBase_player.extend({
        name: 'Dart',

        animSheet: new ig.AnimationSheet('media/units/players/newPirate.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/dart.png'),
        modal: new ig.Image('media/modal/dart_modal.png'),

        levelUpStatPercentage: {
            atk: 0.7,
            mag: 0.0,
            skl: 0.3,
            def: 0.25,
            res: 0.15,
            spd: 0.6,
            luk: 0.5
        },

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 12;
            this.health = 12;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 2;
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
