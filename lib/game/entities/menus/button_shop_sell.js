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
    'use strict';

    ig.global.EntityButton_shop_sell = ig.Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 100, 32),
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),
        name: 'btn_shop_sell',
        text: ['Sell'],

        pressedUp: function() {
            ig.game.battleState = 'selling';
        }
    });
});
