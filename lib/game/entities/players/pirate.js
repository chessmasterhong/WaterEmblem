/**
 *  pirate.js
 *  -----
 *  Friendly assisting units.
 */

ig.module(
    'game.entities.players.pirate'
)
.requires(
    'game.entities.abstractities.base_player'
)
.defines(function() {
    "use strict";

    ig.global.EntityPirate = ig.global.EntityBase_player.extend({
        name: 'Dart',
        // Begin character development system ----------------------------------
        level: 1,

        // Core stats
        health_max: 10,

        stat: {
            // Base stats
            atk: 6, // Attack
            mag: 5, // Magic
            def: 3, // Defense
            res: 5, // Resistance
            spd: 5, // Speed
            luk: 5, // Luck

            // Derived stats
            action_pts: 0, // Action points
        },

        // Resistances
        resist: {
            // Status effects
            poison: 0,   // Poison status resistance
            blind: 0,    // Blind status resistance
            paralyze: 0, // Paralyze status resistance
            daze: 0,     // Daze status resistance
            sleep: 0,    // Sleep status resistance
            confuse: 0   // Confuse status resistance
        },

        // Modifiers (from buffs/debuffs, equipments, class bonuses, etc.)
        mod: {
            health_max: 0,
            atk: 0, mag: 0, def: 0, res: 0, spd: 0, luk: 0,
            poison: 0, blind: 0, paralyze: 0, daze: 0, sleep: 0, confuse: 0
        },

        // Status effects
        status: {
            isPoisoned: false,
            isBlinded: false,
            isParalyzed: false,
            isDazed: false,
            isAsleep: false,
            isConfused: false
        },
        // End character development system ------------------------------------          

        animSheet: new ig.AnimationSheet('media/tilesets/players/pirate.png', 32, 32),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('left', 0.28, [15, 16, 17]);
            this.addAnim('right', 0.28, [22, 23, 24]);
            this.addAnim('down', 0.28, [5, 6, 7, 8]);
            this.addAnim('up', 0.28, [10, 11, 12, 13]);
            this.addAnim('attack', 0.28, [20]);
            
            this.damage = 0;
        },

        check: function(other) {
            this.parent(other);

            // Grid collision checks
            //this.movement.collision();

            // Lock the unit in place and prevent unit from sliding due to collision
            this.pos = ig.global.alignToGrid(this.pos.x, this.pos.y);
            this.vel = {x: 0, y: 0};

            this.destination = null;
            this.movement.destination = null;
            this.movement.direction = null;

            if(other instanceof EntityBase_enemy) {
                //other.realignToGrid();
                if(ig.game.units[ig.game.activeUnit] === this) {
                    other.receiveDamage(this.stat.atk-other.stat.def);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                    this.turnUsed = true;
                }
            }
        }           
    })
});
