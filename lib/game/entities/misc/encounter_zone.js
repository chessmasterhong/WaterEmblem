/*******************************************************************************
  encounter_zone.js
  -----
  A combat transition entity that determines what zone the player is located at
  to generate the correct combat environment.
*******************************************************************************/

ig.module(
    'game.entities.misc.encounter_zone'
)
.requires(
    'impact.entity',
    'game.entities.player',
    'plugins.screen-fader.screen-fader'
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
        zone: 0, // Zone (determines what enemies should appear in encounter)
        chance: 0.1, // Chance of initializing combat per tile (0 = never, 1 = always)

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            stop = false; // Disable player's movement flag
            last_tile_pos = {x: null, y: null}; // Position of last tile stepped on
            tilesize = 32; // Map's tile size (default = 32)
        }, // End init method

        // Override update method and remove this.parent() so as not to
        // waste render cycles drawing an entity with no graphics.
        update: function() {}, // End update method

        // If player collides with this entity and random encounter conditions
        // are triggered, stop player's movement and enter combat mode.
        check: function(other) {
            if(other instanceof EntityPlayer) {
                // Player is standing aligned on a tile (to prevent entering combat while transitioning between tiles)
                if(other.pos.x % tilesize === 0 && other.vel.y % tilesize === 0) {
                    // Player has moved to a new tile (to prevent entering combat while standing idle)
                    if(last_tile_pos.x !== other.pos.x || last_tile_pos.y !== other.pos.y) {
                        // Compute encounter chance. If success, enter combat.
                        if(Math.random() <= this.chance) {
                            ig.global.game_pos = {map: ig.game.director.currentLevel, x: other.pos.x, y: other.pos.y};
                            ig.global.encounter_zone = this.zone;
                            stop = true;
                            this.fadeIn();
                            //ig.system.setGame(BattleMode);
                        }
                    }

                    // Update last tile position
                    last_tile_pos = {x: other.pos.x, y: other.pos.y};

                    // An encounter has occurred, stop player's movement and wait for transition to battlefield
                    if(stop)
                        other.vel = {x: 0, y: 0};
                }
            }
        }, // End check method

        // Create fade effect to transition from game screen to battlefield
        fadeIn: function() {
            this.screenFader = new ig.ScreenFader({
                fade: 'in',
                speed: 4,
                callback: function() { ig.system.setGame(BattleMode); },
                delayBefore: 0.5,
                delayAfter: 1,
            });
        }, // End fadeIn method

        // Draw the fade effect when fadeIn() is called
        draw: function() {
            if(this.screenFader)
               this.screenFader.draw();
        } // End draw method
    }) // End EntityEncounter_zone
}); // End .defines
