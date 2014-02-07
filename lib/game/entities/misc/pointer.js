/**
 *  pointer.js
 *  -----
 *  An invisible entity that follows the mouse pointer. Used to detect when
 *  the mouse is hovered over something interactable in the game.
 *
 *  Resources: http://impactjs.com/forums/help/how-to-handle-clicking
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

        size: {x: 1, y: 1},

        update: function() {
            this.pos = {
                x: ig.input.mouse.x + ig.game.screen.x,
                y: ig.input.mouse.y + ig.game.screen.y
            };
        }
    }) // End EntityPointer
}); // End .defines
