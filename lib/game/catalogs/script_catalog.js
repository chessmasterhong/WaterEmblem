ig.module(
    'game.catalogs.script_catalog'
)
.requires(
    'impact.game',
    'game.entities.menus.button_seize'
)
.defines(function() {
    "use strict";

    ig.global.ScriptCatalog = ig.Class.extend({
        map0: {
            // Map objective
            objective: {
                triggered: false,
                /*condition: function() {
                    // Winning condition: Defeat all enemy units
                    var enemy_count = 0;
                    for(var u = 0; u < ig.game.units.length; u++) {
                        if(ig.game.units[u].unitType === 'enemy') {
                            enemy_count++;
                            if(ig.game.units[u]._killed)
                                enemy_count--;
                        }
                    }

                    if(enemy_count <= 0) {
                        console.log('Objective complete: Party has defeated all enemies.');
                        this.triggered = true;
                        this.script();
                    }
                },*/
                /*condition: function(current_turn, max_turns) {
                    // Winning condition: Survive for specified number of turns
                    if(current_turn >= max_turns) {
                        console.log('Objective complete: Party has survived for ' + current_turn + ' turns.');
                        this.triggered = true;
                        this.script();
                    }
                },*/
                condition: function() {
                    if(ig.game.battleState === 'seize') {
                        console.log('Objective complete: ' + ig.global.main_player_name + ' has seized the tile.');
                        this.triggered = true;
                        this.script();
                    }
                },
                script: function() {
                    console.log('Leaving battle mode.');
                    ig.game.fadeIn();
                }
            }
            // Map scripts
            //script0: {
                //triggered: false,
                //condition: function() {  },
                //script: function() {  }
            //},
            //script1: {
                //triggered: false,
                //condition: function() {  },
                //script: function() {  }
            //}
        },
        map1:{
            objective:{
                triggered: false,
                condition: function() {  },
                script: function() {  }
            }
        }
    });
});
