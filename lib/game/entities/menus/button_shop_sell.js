/**
 *  button_shop_sell.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_sell'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_shop_sell = Button.extend({
        name: 'btn_shop_sell',
        text: ['Sell'],

        pressedUp: function() {
            ig.game.battleState = 'selling';
        }
    });
});
