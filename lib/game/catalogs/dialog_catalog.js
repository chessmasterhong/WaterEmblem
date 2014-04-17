ig.module(
    'game.catalogs.dialog_catalog'
)
.requires(
    'impact.game'
)
.defines(function(){
    "use strict";

    ig.global.Dialog_Catalog = ig.Class.extend({
        map0: {
            speaker1: "Nino",
            speaker2: "Limstella",
            dialog: ["Phrase 1", "Phrase2"]
        }
    });
});