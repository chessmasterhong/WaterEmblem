/**
 *  hero.js
 *  -----
 *  Main character/unit.
 */

ig.module(
    'game.entities.players.hero'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityHero = ig.global.EntityBase_player.extend({
        name: 'player',

        animSheet: new ig.AnimationSheet('media/units/players/newAssassin.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/jaffar.png'),
        modal: new ig.Image('media/modal/jaffar_modal.png'),
        battleAnim: 'EntityHero_battleanim',

        init: function(x, y, settings) {
            // Stats
            this.level = 1;
            this.health = 5;
            this.health_max = 10;
            this.stat.str = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 12;

            // Items
            this.item[0] = ig.game.itemCatalog.sword1;  this.item_uses[0] = this.item[0].uses;
            this.item[1] = ig.game.itemCatalog.item1;   this.item_uses[1] = this.item[1].uses;
            this.item[2] = ig.game.itemCatalog.sword3;  this.item_uses[2] = this.item[2].uses;
            this.item[3] = ig.game.itemCatalog.sword4;  this.item_uses[3] = this.item[3].uses;
            this.item[4] = ig.game.itemCatalog.sword5;  this.item_uses[4] = this.item[4].uses;

            // IMPORTANT!! Keep these last in the unit's init() method. No exceptions!
            this.derived_stats = ig.game.recomputeStats(this);
            this.parent(x, y, settings);
        }
    })
});
