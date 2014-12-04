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
    'use strict';

    ig.global.EntityTroubadour = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityTroubadour'],

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
            //this.item[0] = null;  this.item_uses[0] = this.item[0].uses;
            //this.item[1] = null;  this.item_uses[1] = this.item[1].uses;
            //this.item[2] = null;  this.item_uses[2] = this.item[2].uses;
            //this.item[3] = null;  this.item_uses[3] = this.item[3].uses;
            //this.item[4] = null;  this.item_uses[4] = this.item[4].uses;

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    });
});
