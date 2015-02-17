ig.module(
    'game.catalogs.objective_catalog'
)
.requires(
    'impact.game',
    'game.entities.menus.button_seize'
)
.defines(function() {
    'use strict';

    ig.global.ObjectiveCatalog = ig.Class.extend({
        defeatAllEnemies: function() {
            // Winning condition: Defeat all enemy units
            var enemy_count = 0;
            for(var u = 0; u < ig.game.units.length; u++) {
                if(ig.game.units[u].unitType === 'enemy') {
                    enemy_count++;
                    if(ig.game.units[u]._killed) {
                        enemy_count--;
                    }
                }
            }

            if(enemy_count <= 0) {
                console.log('Objective complete: Party has defeated all enemies.');
                return true;
            }

            return false;
        },

        surviveForTurns: function(max_turns) {
            // Winning condition: Survive for specified number of turns
            if(ig.game.turn_counter >= max_turns) {
                console.log('Objective complete: Party has survived for ' + ig.game.turn_counter + ' turns.');
                return true;
            }

            return false;
        },

        seizeTile: function() {
            // Winning condition: Seize a specific tile (throne tile)
            if(ig.game.battleState === 'seize') {
                console.log('Objective complete: ' + ig.global.main_player_name + ' has seized the tile.');
                return true;
            }

            return false;
        }
    });
});
