/**
 *  pointer.js
 *  -----
 *  An invisible entity that follows the mouse cursor. Used to detect when
 *  the cursor is hovered over something interactable in the game.
 *
 *  Resources:
 *      http://impactjs.com/forums/help/how-to-handle-clicking
 *      http://impactjs.com/forums/help/i-writed-whether-entity-is-clicked-function-which-need-to-be-improved/page/1
 *      http://pointofimpactjs.com/snippets/view/21/detect-double-click
 */

ig.module(
    'game.entities.misc.pointer'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityPointer = ig.Entity.extend({
        //type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.NEVER,

        // Define size of pointer for detecting collisions
        size: {x: 1, y: 1},

        isClicking: false,

        update: function() {
            this.parent();

            // Update position to follow mouse cursor
            this.pos = {
                x: ig.input.mouse.x + ig.game.screen.x,
                y: ig.input.mouse.y + ig.game.screen.y
            };

            // Only check for click once per frame, instead of for each entity
            // collided with in check() method.
            this.isClicking = ig.input.pressed('leftClick');
            //this.isClicking = ig.input.pressed('leftClick') && this.inFocus();
        },

        /*inFocus: function() {
            return (
                this.pos.x <= ig.input.mouse.x + ig.game.screen.x &&
                this.pos.y <= ig.input.mouse.y + ig.game.screen.y &&
                ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x &&
                ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y
            );
        },*/

        check: function(other) {
            this.parent(other);

            // User is hovering over the 'other' entity and has a hovered() method
            if(typeof other.hovered === 'function') {
                other.focused();
            }

            // User is clicking and the 'other' entity and has a clicked() method
            if(this.isClicking && typeof other.clicked === 'function') {
                other.clicked();
            }
        }
    }) // End EntityPointer
}); // End .defines
