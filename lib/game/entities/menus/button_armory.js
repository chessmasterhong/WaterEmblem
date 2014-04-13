/**
*   button_armory.js
*   ----------------
*/

ig.module(
    'game.entities.menus.button_armory'
)
.requires(
    'plugins.button.button'
)

.defines(function(){
    "use strict";

    ig.global.EntityButton_armory = Button.extend({
        name: 'btn_armory',
        text: ['Armory'],

        pressedUp: function(){
            console.log("Pressed armory button");
            ig.game.battleState = 'shopping';
            if(typeof ig.game.getEntityByName('shop') === 'undefined')
                ig.game.spawnEntity(EntityOverlay_shop, 0, 0);
        }
    });
});
