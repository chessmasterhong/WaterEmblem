/**
 *  overlay_startscreen.js
 *  -----
 *  Start screen overlay image.
 */

ig.module(
    'game.entities.overlays.overlay_startscreen'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityOverlay_startscreen = ig.Entity.extend({
        screenBackground: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.screenBackground = new ig.Image('media/start_screen.png');
        },

        draw: function() {
            this.parent();

            this.screenBackground.draw(0, 0);
        }
    });
});
