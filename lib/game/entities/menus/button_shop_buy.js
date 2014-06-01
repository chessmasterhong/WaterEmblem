/**
 *  button_shop_buy.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_buy'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_shop_buy = ig.Button.extend({
        name: 'btn_shop_buy',
        text: ['Buy'],

        pressedUp: function() {
            ig.game.battleState = 'buying';
        }
    });
});
