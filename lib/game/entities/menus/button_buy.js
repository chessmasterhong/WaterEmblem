/**
 *  button_buy.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_buy'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_buy = Button.extend({
        name: 'btn_buy',
        text: ['Buy'],

        pressedUp: function() {
            console.log("clicked buy button");
            ig.game.battleState = 'buying';
            console.log(ig.game.battleState)
        }
    });
});
