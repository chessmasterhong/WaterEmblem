ig.module(
    'game.catalogs.dialog_catalog'
)
.requires(
    'impact.game'
)
.defines(function(){
    "use strict";

    ig.global.DialogCatalog = ig.Class.extend({
        map0: { 
            speaker1: Nino,
            speaker2: Jaffar,
            dialog = ["Jaffar: ...", "Eliwood: ????", "Jaffar: Die."],
        }
    });
});