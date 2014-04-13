/**
 *  button_sell.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_sell'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_sell = Button.extend({
        name: 'btn_sell',
        text: ['Sell'],

        pressedUp: function() {
            console.log("clicked sell button");
            ig.game.battleState = 'selling';
            console.log(ig.game.battleState)
        }
    });
});
