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
                condition: function(entity, enemy_count) {
                    if(typeof entity !== 'undefined' && entity.unitType === 'player' && enemy_count === 0)
                        this.triggered = true;
                },
                //script: function() {  }
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
        }
    });
});
