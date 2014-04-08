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
                triggered: false,
                condition: function() {  },
                script: function() {  }
            },
            // Map scripts
            script0: {
                triggered: false,
                condition: function() {  },
                script: function() {  }
            },
            script1: {
                triggered: false,
                condition: function() {  },
                script: function() {  }
            },
            script2: {
                triggered: false,
                condition: function() {  },
                script: function() {  }
            }
        }
    });
});
