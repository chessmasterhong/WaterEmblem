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
    "use strict";

    ig.global.EntityButton_shop_exit = Button.extend({
        name: 'btn_exit',
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
