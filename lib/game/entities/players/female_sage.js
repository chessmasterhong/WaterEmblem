/**
 *  female_sage.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.female_sage'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    'use strict';

    ig.global.EntityFemale_sage = ig.global.EntityBase_player.extend({
        entityClassName: ['EntityFemale_sage'],

        name: 'Nino',

        animSheet: new ig.AnimationSheet('media/units/players/newFemaleSage.png', 32, 32),
        // character picture for status screen (175 x 175 px)
        statMugshot: new ig.Image('media/statMugshots/players/nino.png'),
        // charcter picture for cutscenes, trading, equipping (200 x 200 px)
        mugshot: new ig.Image('media/mugshots/players/nino.png'),
        modal: new ig.Image('media/modal/nino_modal.png'),
        battleAnim: 'EntitySage_battleanim',

        init: function(x, y, settings) {

            // Stats
            this.level = 1;
            this.health_max = ig.game.generateRandomInt(20, 40);
            this.stat.str = ig.game.generateRandomInt(10, 15);
            this.stat.mag = ig.game.generateRandomInt(10, 15);
            this.stat.def = ig.game.generateRandomInt(10, 15);
            this.stat.res = ig.game.generateRandomInt(10, 15);
            this.stat.spd = ig.game.generateRandomInt(10, 15);
            this.stat.skl = ig.game.generateRandomInt(10, 15);
            this.stat.luk = ig.game.generateRandomInt(10, 15);
            this.stat.mov = 5;


            this.validWeapon = ['tome', 'staff'];
            
            // Items
            this.item[0] = ig.game.itemCatalog.tome2;  this.item_uses[0] = this.item[0].uses;
            this.item[1] = ig.game.itemCatalog.staff1;   this.item_uses[1] = this.item[1].uses;
            this.item[2] = ig.game.itemCatalog.item2;   this.item_uses[2] = this.item[2].uses;
            this.item[3] = ig.game.itemCatalog.item2;   this.item_uses[3] = this.item[3].uses;
            this.item[4] = ig.game.itemCatalog.item4;   this.item_uses[4] = this.item[4].uses;

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    });
});
