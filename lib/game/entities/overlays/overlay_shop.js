/**
 *  overlay_shop.js
 *  -----
 *  Shop overlay image.
 */

ig.module(
    'game.entities.overlays.overlay_shop'
)
.requires(
    'impact.entity'
)
.defines(function() {
    'use strict';

    ig.global.EntityOverlay_shop = ig.Entity.extend({
        shopScreen: null,
        name: 'shop',

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.shopScreen = new ig.Image('media/gui/shop_screen.png');
        },

        draw: function() {
            this.parent();

            this.shopScreen.draw(0, 0);
        }
    });
});
