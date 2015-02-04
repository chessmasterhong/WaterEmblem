/**
 *  button_shop_confirm_sell.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_confirm_sell'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    'use strict';

    ig.global.EntityButton_shop_confirm_sell = ig.Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 100, 32),
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),
        name: 'btn_shop_confirm_sell',
        text: ['Yes'],

        pressedUp: function() {
            console.log("clicked");
            ig.game.soldItemTimer.reset();
            ig.game.soldItem = true;
            ig.game.soldItemName = ig.game.units[ig.game.activeUnit].item[ig.game.units[ig.game.activeUnit].selectedItemIndex].name;
            ig.global.gold += ig.game.units[ig.game.activeUnit].item[ig.game.units[ig.game.activeUnit].selectedItemIndex].cost;
            // Set sold item to be null
            ig.game.units[ig.game.activeUnit].item[ig.game.units[ig.game.activeUnit].selectedItemIndex] = null;
            // Redraw the player's inventory
            for(i = 0; i < ig.game.units[ig.game.activeUnit].item.length; i++) {
                // console.log('mememem');
                ig.game.getEntityByName('btn_item_a' + i).kill();
            }

            ig.game.units[ig.game.activeUnit].selectedItemIndex = null;
            ig.game.confirmSell = false; 

            ig.global.killAllButtons(ig.Button);
            if(typeof ig.game.getEntityByName('btn_shop_exit') === 'undefined') {
                ig.game.spawnEntity(ig.global.EntityButton_shop_exit, ig.game.screen.x + 264, ig.game.screen.y + 132);
                ig.game.spawnEntity(ig.global.EntityButton_shop_buy, ig.game.screen.x + 164, ig.game.screen.y + 132);
                ig.game.spawnEntity(ig.global.EntityButton_shop_sell, ig.game.screen.x + 364, ig.game.screen.y + 132);
            }
        }
    });
});
