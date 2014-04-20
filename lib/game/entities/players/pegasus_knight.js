/**
 *  pegasus_knight.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.pegasus_knight'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityPegasus_knight = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityPegasus_knight'],

        name: 'Florina',

        animSheet: new ig.AnimationSheet('media/units/players/newPegasusKnight.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/florina.png'),
        modal: new ig.Image('media/modal/florina_modal.png'),
        battleAnim: 'EntityPegasus_knight_battleanim',

        levelUpStatPercentage: {
            atk: 0.4,
            mag: 0.4,
            skl: 0.6,
            def: 0.35,
            res: 0.35,
            spd: 0.7,
            luk: 0.6
        },

        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health_max = 13;
            this.health = 13;
            this.stat.atk = 5;
            this.stat.skl = 8;
            this.stat.mag = 2;
            this.stat.def = 4;
            this.stat.res = 4;
            this.stat.spd = 7;
            this.stat.luk = 3;
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
