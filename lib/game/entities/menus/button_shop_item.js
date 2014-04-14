/**
 *  button_shop_item.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_shop_item'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_shop_item = Button.extend({
        index: 0,

        animSheet: new ig.AnimationSheet('media/gui/bignewMenu.png', 200, 32),
        size: {x: 200, y: 32},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.name = 'btn_shop_item_' + this.index;
            this.iconLeft = ig.game.itemCatalog.shop1[this.index] !== null ? ig.game.itemCatalog.shop1[this.index].icon : null;
            this.text = [ig.game.itemCatalog.shop1[this.index] !== null ? ig.game.itemCatalog.shop1[this.index].name : '----'];
            this.textRight = [ig.game.itemCatalog.shop1[this.index] !== null ? ig.game.itemCatalog.shop1[this.index].uses : ''];
        },

        pressedUp: function() {
            ig.game.selectedShopItemIndex = this.index;
        }
    });
});
