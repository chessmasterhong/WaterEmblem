/**
 *  encounter_zone.js
 *  -----
 *  A combat transition entity that determines what zone the player is located
 *  at to generate the correct combat environment.
 */

ig.module(
    'game.entities.misc.encounter_zone'
)
.requires(
    'impact.entity',
    'game.entities.abstractities.base_player',
    'plugins.screen-fader.screen-fader'
)
.defines(function() {
    "use strict";

    ig.global.EntityEncounter_zone = ig.Entity.extend({
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

        // Set in Weltmeister
        zone: 0, // Zone (determines what enemies should appear in encounter)
        chance: 1, // Chance of initializing combat per tile (0 = never, 1 = always)
        spawn_min: 2, // Minimum number of enemies to spawn (default: 2)
        spawn_max: 4, // Maximum number of enemies to spawn (default: 4)

        // Initialize properties
        last_tile_pos: null,
        stop: 0,
        destination: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
        }, // End init method

        // Override update method and remove this.parent() so as not to
        // waste render cycles drawing an entity with no graphics.
        update: function() {}, // End update method

        // If player collides with this entity and random encounter conditions
        // are triggered, stop player's movement and enter combat mode.
        check: function(other) {
            if(other instanceof EntityBase_player) {
                // An encounter has not occurred --> Wait for encounter and compute current/destination tile position
                if(this.stop === 0) {
                    // Player has moved to a new tile (to prevent entering combat while standing idle)
                    if(this.last_tile_pos !== null && (this.last_tile_pos.x !== other.pos.x || this.last_tile_pos.y !== other.pos.y)) {
                        // Compute encounter chance. If success, enter combat.
                        if(Math.random() <= this.chance) {
                            // Get player's position rounded to nearest multiple of tilesize
                            // Check if player is moving and compute the destination tile (rounded to multiple of tilesize)
                            this.destination = ig.global.alignToGrid(other.pos.x, other.pos.y);
                            this.destination.x += this.sgn(other.vel.x) * ig.global.tilesize;
                            this.destination.y += this.sgn(other.vel.y) * ig.global.tilesize;

                            // Exit encounter check loop
                            this.stop = 1;
                        }
                    }

                    // Update last tile position
                    this.last_tile_pos = {x: other.pos.x, y: other.pos.y};
                // An encounter has occurred --> Wait until player reaches destination tile, log player's position, and start transition to battlefield
                } else if(this.stop === 1) {
                    // Wait until player reaches destination tile
                    if((other.pos.x <= this.destination.x && other.last.x > this.destination.x) ||
                       (other.pos.x >= this.destination.x && other.last.x < this.destination.x) ||
                       (other.pos.y <= this.destination.y && other.last.y > this.destination.y) ||
                       (other.pos.y >= this.destination.y && other.last.y < this.destination.y)) {
                        // Log player's position, get encounter zone, and spawn amount for this entity
                        ig.global.game_pos = {map: ig.game.director.currentLevel, x: this.destination.x, y: this.destination.y};
                        ig.global.encounter = {zone: this.zone, spawn_min: this.spawn_min, spawn_max: this.spawn_max};

                        // Begin fade transition into battlefield
                        this.fadeIn();

                        // Exit logging and transition loop (otherwise transition will be called/reseted indefinately and will not proceed)
                        this.stop = 2;
                    }
                } else if(this.stop === 2) {
                    // Stop player's movement, wait for fade transition to finish, and enter battlefield
                    other.pos = this.destination;
                    other.vel = {x: 0, y: 0};
                }
            }
        }, // End check method

        // Create fade effect to transition from game screen to battlefield
        fadeIn: function() {
            this.screenFadeIn = new ig.ScreenFader({
                fade: 'in',
                speed: 4,
                callback: function() { ig.system.setGame(ig.BattleMode); },
                delayBefore: 1,
                delayAfter: 1
            });
        }, // End fadeIn method

        draw: function() {
            // Draw the fade effect when fadeIn() is called
            if(this.screenFadeIn)
               this.screenFadeIn.draw();
        }, // End draw method

        /**
         *  int this.sgn(number num)
         *  -----
         *  Sign function or signum function. Extracts the sign of a real number.
         *
         *  Precondition:
         *      num: A real number.
         *
         *  Postcondition:
         *      Returns the sign of the number.
         *
         *  Example:
         *      sgn(3.5) // 1
         *      sgn(-8)  // -1
         *      sgn(0)   // 0
         */
        sgn: function(num) {
            return (num > 0) - (num < 0);
        }
    }); // End EntityEncounter_zone
}); // End .defines
