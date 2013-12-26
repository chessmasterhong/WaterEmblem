/***********************************************************************
  encounter_zone.js
  =================
  A combat transition entity that determines what zone the player is located at
  to generate the correct combat environment.
***********************************************************************/

ig.module(
    'game.entities.misc.encounter_zone'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function() {
    EntityEncounter_zone = ig.Entity.extend({
        //type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        // This entity doesn't have graphics, so we create a box that
        // is displayed within Weltmeister to represent this entity.
        // Tell Weltmeister how to render the object inside edit view.
        // The following draws a blue 8x8 resizable box.
        _wmBoxColor: 'rgba(0, 0, 255, 0.3)',
        _wmDrawBox: true,
        _wmScalable: true,
        size: {x: 8, y: 8},

        // Set zone and encounter rate/chance to null (set in Weltmeister)
        zone: null,
        chance: 0.01, // Chance of initializing combat per tile (0 = never, 1 = always)

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            lastTile_pos_x = null;
            lastTile_pos_y = null;
        },

        // Override update method and remove this.parent() so as not to
        // waste render cycles drawing an entity with no graphics.
        update: function() {},

        check: function(other) {
            // If player collides with this entity and proper random encounter
            // conditions are triggered, enter combat mode.
            if(other instanceof EntityPlayer) {
                // Player is standing aligned on a tile (to prevent entering combat while transitioning between tiles)
                if(other.pos.x % 32 === 0 && other.vel.y % 32 === 0) {
                    // Player has moved to a new tile (to prevent entering combat while standing idle)
                    if(lastTile_pos_x !== other.pos.x || lastTile_pos_y !== other.pos.y) {
                        // Compute encounter chance. If success, enter combat.
                        if(Math.random() <= this.chance) {
                            console.log('Enter combat mode!');
                            ig.system.setGame(CombatMode);
                        }
                    }

                    // Update last tile position
                    lastTile_pos_x = other.pos.x;
                    lastTile_pos_y = other.pos.y;
                }
            }
        },
    }) // End EntityEncounter_zone
}); // End .defines
