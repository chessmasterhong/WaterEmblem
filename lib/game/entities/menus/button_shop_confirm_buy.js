/**
 *  button_shop_confirm_buy.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_confirm_buy'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    'use strict';

    ig.global.EntityButton_shop_confirm_buy = ig.Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 100, 32),
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),
        name: 'btn_shop_confirm_buy',
        text: ['Yes'],

        pressedUp: function() {
            ig.game.boughtItemTimer.reset();
            ig.game.boughtItem = true;
            ig.game.boughtItemName = ig.game.itemCatalog.shop1[ig.game.selectedShopItemIndex].name;
            var slot = ig.game.getFreeSlot(ig.game.units[ig.game.activeUnit]);
            if(slot !== null) {
                if(ig.global.gold >= ig.game.itemCatalog.shop1[ig.game.selectedShopItemIndex].cost) {
                    ig.global.gold -= ig.game.itemCatalog.shop1[ig.game.selectedShopItemIndex].cost;
                    ig.game.units[ig.game.activeUnit].item[slot] = ig.game.itemCatalog.shop1[ig.game.selectedShopItemIndex];
                    ig.game.units[ig.game.activeUnit].item_uses[slot] = ig.game.itemCatalog.shop1[ig.game.selectedShopItemIndex].uses;
                    ig.game.recomputeStats(ig.game.units[ig.game.activeUnit]);
                } else {
                    ig.game.lowMoney = true;
                    ig.game.lowMoneyTimer.reset();
                    console.log('You do not have enough money!');
                }
            } else {
                ig.game.fullInventory = true;
                ig.game.fullInventoryTimer.reset();
                console.log('Inventory full!');
            }
            ig.game.sfx.play('money');
            ig.game.selectedShopItemIndex = null;
            ig.game.confirmBuy = false;
            ig.game.buySellConfirmed = false;

            ig.global.killAllButtons(ig.Button);
        }
    });
});
