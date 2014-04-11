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
        }
    });
});