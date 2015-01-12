/**
 *  pointer.js
 *  -----
 *  An invisible entity that follows the mouse cursor. Used to detect when
 *  the cursor is hovered over something interactable in the game.
 *
 *  Resources:
 *      http://impactjs.com/forums/help/how-to-handle-clicking
 *      http://impactjs.com/forums/help/how-to-change-a-entitys-animsheet/page/1
 */

ig.module(
    'game.entities.misc.pointer'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityPointer = ig.Entity.extend({
        name: 'pointer',

        checkAgainst: ig.Entity.TYPE.BOTH,

        // Multiple animation sheets
        freeAnimSheet: null,
        gridAnimSheet: new ig.AnimationSheet('media/gui/cursor.png', 32, 32),

        // Define size of pointer for detecting collisions
        size: {x: 1, y: 1},

        isLeftClicking: false,
        isRightClicking: false,
        isHoveringOverUnit: false,

        forceSnapToGrid: false,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.anims.idle_free = null;
            this.anims.idle_grid = new ig.Animation(this.gridAnimSheet, 0.08, [0, 0, 0, 0, 1, 2, 1]);
        },

        update: function() {
            this.parent();

            // Update position to follow mouse cursor
            if(ig.game.menuVisible && !this.forceSnapToGrid) {
                // Free-moving mouse cursor when displaying menu
                // (so cursor does not 'avoid' buttons by snapping to grid)
                this.currentAnim = this.anims.idle_free;
                this.pos = {
                    x: ig.input.mouse.x + ig.game.screen.x,
                    y: ig.input.mouse.y + ig.game.screen.y
                };
            } else {
                // Grid-snapping mouse cursor when not displaying menu
                // (so user can see which tile is being hovered over)
                this.currentAnim = this.anims.idle_grid;
                this.pos = ig.global.alignToGrid(
                    ig.input.mouse.x + ig.game.screen.x,
                    ig.input.mouse.y + ig.game.screen.y
                );

                // Get hovered terrain data
                if(typeof ig.game.terrain !== 'undefined') {
                    ig.game.hoveredTerrain = ig.game.getTerrain(this.pos.x, this.pos.y);
                    //console.log('Terrain Type: ' + ig.game.hoveredTerrain.type);
                }

                // Crude method to search which unit is hovered over
                // TODO: Optimize this.
                this.isHoveringOverUnit = false;
                if(typeof ig.game.units !== 'undefined') {
                    for(var u = 0; u < ig.game.units.length; u++) {
                        if(this.touches(ig.game.units[u])) {
                            ig.game.hoveredUnit = ig.game.units[u];
                            this.isHoveringOverUnit = true;
                        }
                    }

                    if(!this.isHoveringOverUnit)
                        ig.game.hoveredUnit = null;
                }
            }

            // Only check for click once per frame, instead of for each entity
            // collided with in check() method.
            this.isLeftClicking = ig.input.pressed('leftClick');
            this.isRightClicking = ig.input.pressed('rightClick');

            // If clicked on a non-entity on battlefield, deselect selected unit
            /*if(this.isClicking && typeof ig.game.clickedUnit !== 'undefined' && ig.game.clickedUnit !== null) {
                ig.game.clickedUnit = null;
            }*/
        },

        check: function(other) {
            this.parent(other);

            // User is clicking and the 'other' entity and has a clicked() method
            if(this.isLeftClicking && typeof other.leftClicked === 'function')
                other.leftClicked();
            if(this.isRightClicking && typeof other.rightClicked === 'function')
                other.rightClicked();
        }
    }); // End EntityPointer
}); // End .defines
