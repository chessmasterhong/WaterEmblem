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

        animSheet: new ig.AnimationSheet('media/units/players/assassin.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/jaffar.png'),
        modal: new ig.Image('media/modal/jaffar_modal.png'),
        battleAnim: 'EntityHero_battle',

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats
            this.level = 1;
            this.health_max = 10;
            this.stat.atk = 6;
            this.stat.mag = 5;
            this.stat.def = 3;
            this.stat.res = 5;
            this.stat.spd = 5;
            this.stat.luk = 4;
            this.stat.mov = 4;

            // Items
            this.item[0] = this.itemCatalog.sword1.name;
            this.item[1] = this.itemCatalog.sword2.name;

            // Animation states
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [10, 11, 12, 13]);
            this.addAnim('down', 0.28, [5, 6, 7, 8]);
            this.addAnim('left', 0.28, [15, 16, 17]);
            this.addAnim('right', 0.28, [20, 21, 22]);
        },

        // If main character is defeated, game over
        kill: function() {
            this.parent();
            ig.system.setGame(ig.GameOver);
        }
    })
});
