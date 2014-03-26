/**
 *  base_player.js
 *  -----
 *  Base player/playable unit. This is an abstract entity that should beextended.
 */

ig.module(
    'game.entities.abstractities.base_battleanim'
)
.requires(
    'impact.entity'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_battleanim = ig.Entity.extend({
        flip: false,
        
        init: function(x, y, settings) {
            this.parent(x, y, settings);

            // Flip all animations appropriately
            for(var anim in this.anims)
                this.anims[anim].flip.x = this.flip;
        },

        update: function() {
            this.parent();

            // Quickfix for any animations still not flipped appropriately
            this.currentAnim.flip.x = this.flip;

            // Dynamic animation sizing and offsetting
            if(this.currentAnim === this.anims.attack0 || this.currentAnim === this.anims.attack1) {
                this.size = this.attackSize;
                this.offset = this.attackOffset;
            } else if(this.currentAnim === this.anims.crit0 || this.currentAnim === this.anims.crit1) {
                this.size = this.critSize;
                this.offset = this.critOffset;
            } else {
                this.size = this.attackSize;
                this.offset = this.attackOffset;
            }
        }
    });
});
