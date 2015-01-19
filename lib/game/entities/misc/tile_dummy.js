/**
 *  tile_dummy.js
 *  -----
 *  An invisible, non-interactive tile (32px x 32px) entity used as placeholder
 *  to assist in performing tile-based game calculations.
 */

ig.module(
    'game.entities.misc.tile_dummy'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityTile_dummy = ig.Entity.extend({
        checkAgainst: ig.Entity.TYPE.BOTH,

        size: {x: 1, y: 1},

        distance: 0,

        // Override draw and update method and remove this.parent() so as
        // not to waste render cycles drawing an entity with no graphics.
        update: function() {},
        draw: function() {},

        checkEntities: function() {
            // Crude method to search which unit is hovered over
            // TODO: Optimize this.
            if(typeof ig.game.units !== 'undefined') {
                for(var u = 0; u < ig.game.units.length; u++) {
                    if(this.touches(ig.game.units[u]) && ig.game.units[u]._killed === false) {
                        return ig.game.units[u];
                    }
                }
            }
        }
    }); // End EntityTile_dummy
}); // End .defines
