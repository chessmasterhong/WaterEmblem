/**
* overlay_dialog.js
* ----
* Entity used for displaying modals for dialog
*
*/

ig.module(
    'game.entities.overlays.overlay_dialog'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityOverlay_dialog = ig.Entity.extend({
        size: {x: 200, y: 200},

        NinoMugshot: new ig.Image('media/mugshots/players/nino.png'),
        LimstellaMugshot: new ig.Image('media/mugshots/players/limstella.png'),

        draw: function(){
            this.parent();
        }
    });
});
