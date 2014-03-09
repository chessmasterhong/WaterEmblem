/**
 *  arch_sage.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.arch_sage'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityArch_sage = ig.global.EntityBase_player.extend({
        name: 'Athos',

        animSheet: new ig.AnimationSheet('media/units/players/newArchSage.png', 32, 32),
        statMugshot: new ig.Image('media/mugshots/players/athos.png'),
        modal: new ig.Image('media/modal/athos_modal.png'),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Stats

            // Items
            //this.item[0] = null;
            //this.item[1] = null;
            //this.item[2] = null;
            //this.item[3] = null;
            //this.item[4] = null;

            this.derived_stats = ig.game.recomputeStats(this);

        }
    })
});
