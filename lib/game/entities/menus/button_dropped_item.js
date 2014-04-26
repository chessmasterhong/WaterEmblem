/**
 *  button_dropped_item.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_dropped_item'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    "use strict";

    ig.global.EntityButton_dropped_item = Button.extend({
        animSheet: new ig.AnimationSheet('media/gui/bignewMenu.png', 200, 32),
        size: {x: 200, y: 32},

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.name = 'btn_dropped_item';
            this.iconLeft = ig.game.item_drop !== null ? ig.game.item_drop.icon : null;
            this.text = [ig.game.item_drop !== null ? ig.game.item_drop.name : '----'];
            this.textRight = [ig.game.item_drop !== null ? ig.game.item_drop_uses : ''];
        },

        pressedUp: function() {
            // Set selected item index to null, in the case where an inventory item was clicked before clicking dropped item.
            if(ig.game.units[ig.game.activeUnit].unitType === 'player') {
                ig.game.units[ig.game.activeUnit].selectedItemIndex = null;
                ig.game.units[ig.game.activeUnit].selectedWeapon = ig.game.item_drop;
                ig.game.units[ig.game.activeUnit].isEquipping = true;
            } else if(ig.game.units[ig.game.activeUnit].unitType === 'enemy') {
                ig.game.targetedUnit.selectedItemIndex = null;
                ig.game.targetedUnit.selectedWeapon = ig.game.item_drop;
                ig.game.targetedUnit.isEquipping = true;
            }

            if(typeof ig.game.getEntityByName('btn_inventory_item_discard') !== 'undefined') {
                ig.game.getEntityByName('btn_inventory_item_discard').kill();
                ig.game.spawnEntity(EntityButton_inventory_item_discard, ig.game.screen.x + 296, ig.game.screen.y + 96);
            }

            if(typeof ig.game.getEntityByName('btn_weapon_equip') !== 'undefined')
                ig.game.getEntityByName('btn_weapon_equip').kill();

            if(typeof ig.game.getEntityByName('btn_inventory_item_use') !== 'undefined')
                ig.game.getEntityByName('btn_inventory_item_use').kill();
        }
    });
});
