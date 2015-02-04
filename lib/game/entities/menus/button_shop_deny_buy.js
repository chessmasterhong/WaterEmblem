/**
 *  button_shop_deny_buy.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_deny_buy'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    'use strict';

    ig.global.EntityButton_shop_deny_buy = ig.Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 100, 32),
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),
        name: 'btn_shop_deny_buy',
        text: ['No'],

        pressedUp: function() {
            ig.game.confirmBuy = false;
            ig.game.selectedShopItemIndex = null;
            ig.global.killAllButtons(ig.Button);
            if(typeof ig.game.getEntityByName('btn_shop_exit') === 'undefined') {
                ig.game.spawnEntity(ig.global.EntityButton_shop_exit, ig.game.screen.x + 264, ig.game.screen.y + 132);
                ig.game.spawnEntity(ig.global.EntityButton_shop_buy, ig.game.screen.x + 164, ig.game.screen.y + 132);
                ig.game.spawnEntity(ig.global.EntityButton_shop_sell, ig.game.screen.x + 364, ig.game.screen.y + 132);
            }  

            
        }
    });
});
