ig.module(
    'game.catalogs.script_catalog'
)
.requires(
    'impact.game'
)
.defines(function() {
    "use strict";

    ig.global.ScriptCatalog = ig.Class.extend({
        map0: {
            // Map objective
            objective: {
                // Winning condition: Defeat all enemy units
                triggered: false,
                condition: function() {
                    var enemy_count = 0;
                    for(var u = 0; u < ig.game.units.length; u++) {
                        if(ig.game.units[u].unitType === 'enemy') {
                            enemy_count++;
                            if(ig.game.units[u]._killed)
                                enemy_count--;
                        }
                    }

                    if(enemy_count <= 0) {
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
        map1: {
            // Map objective
            objective: {
                // Leave current map after certain amount of turns
                triggered: false,
                condition: function(turn_count) {

                    if(turn_count == 10)
                    {
                        this.triggered= true;
                        this.script();
                    }
                },
                script: function() {
                    console.log('Leaving battle mode.');
                    ig.game.fadeIn();
                }
            }        
        }
    });
});
