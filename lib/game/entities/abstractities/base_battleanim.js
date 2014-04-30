/**
 *  base_player.js
 *  -----
 *  Base battle animation. This is an abstract entity that should be extended.
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
        fade: false,

        update: function() {
            this.parent();

            // Quickfix for any animations still not flipped appropriately
            for(var anim in this.anims)
                this.anims[anim].flip.x = this.flip;

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

            // Fade away animation when fade flag is triggered due to unit being defeated
            if(this.fade) {
                if(typeof this.fadeTimer === 'undefined')
                    this.fadeTimer = new ig.Timer();
                else
                    this.currentAnim.alpha = this.fadeTimer.delta() < 1 ? 3.5 - 3.5 * this.fadeTimer.delta() : 0;
            }
        }
    });
});
