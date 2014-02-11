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
    "use strict";

    ig.global.EntityTile_dummy = ig.Entity.extend({
        name: 'tile_dummy',

        //type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.NEVER,

        // Define size for detecting collisions
        size: {x: 32, y: 32},

        // Override update method and remove this.parent() so as not to
        // waste render cycles drawing an entity with no graphics.
        update: function() {},
    }) // End EntityTile_dummy
}); // End .defines
