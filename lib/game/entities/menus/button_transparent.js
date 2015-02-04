/**
 *  button_transparent.js
 *  -----
 */

ig.module(
    'game.entities.menus.button_transparent'
)
.requires(
    'plugins.button.button'
)
.defines(function() {
    'use strict';

    ig.global.EntityButton_transparent = ig.Button.extend({
        index: 0,

        animSheet: new ig.AnimationSheet('media/gui/transparentbutton.png', 385, 32),
        size: {x: 385, y: 32},
        font: new ig.Font('media/fonts/verdana_20.font.png',  { fontColor: '#E5E5E5' }),

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.name = 'btn_item_a' + this.index;
            this.iconLeft = ig.game.units[ig.game.activeUnit].item[this.index] !== null ? ig.game.units[ig.game.activeUnit].item[this.index].icon : null;
            this.text = [ig.game.units[ig.game.activeUnit].item[this.index] !== null ? ig.game.units[ig.game.activeUnit].item[this.index].name : '----'];
            this.textRight = [ig.game.units[ig.game.activeUnit].item[this.index] !== null ? ig.game.units[ig.game.activeUnit].item_uses[this.index] : ''];
        },

        pressedUp: function() {
            // Determine which item is being selected.
            ig.game.units[ig.game.activeUnit].selectedItemIndex = this.index;
        }
    });
});
