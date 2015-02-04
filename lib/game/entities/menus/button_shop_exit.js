/**
 *  button_shop_exit.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_exit'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    'use strict';

    ig.global.EntityButton_shop_exit = ig.Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 100, 32),
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),
        name: 'btn_shop_exit',
        text: ['Exit'],

        pressedUp: function() {
            // All combat preparations are set; signal main game to wait for user to select target
            if(typeof ig.game.getEntityByName('shop') !== 'undefined')
                ig.game.getEntityByName('shop').kill();
            ig.game.battleState = 'null';
            ig.game.units[ig.game.activeUnit].turnUsed = true;
        }
    });
});
