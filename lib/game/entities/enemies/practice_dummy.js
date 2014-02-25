/**
 *  dummy_target.js
 *  -----
 *  A simple "punching bag enemy".
 */

ig.module(
    'game.entities.enemies.practice_dummy'
)
.requires(
    'game.entities.abstractities.base_enemy'
)
.defines(function() {
    "use strict";

    ig.global.EntityPractice_dummy = ig.global.EntityBase_enemy.extend({
        animSheet: new ig.AnimationSheet('media/tilesets/enemies/soldier.png', 32, 32),
		//Enemy base stats
        stat: {
            atk: 4, // Attack
            mag: 5, // Magic
            def: 3, // Defense
            res: 5, // Resistance
        },        

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 0.28, [0, 1, 2]);
            this.addAnim('up', 0.28, [5, 6, 7, 8]);
            this.addAnim('down', 0.28, [10, 11, 12, 13]);
            this.addAnim('left', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('right', 0.28, [10, 11, 12, 13]); // Repeat of 'down' animation
            this.addAnim('attack', 0.28, [15, 16]);
        },

        check: function(other) {
            this.parent(other);


            if(other instanceof EntityBase_player) {
                //other.pos = ig.global.alignToGrid(other.pos.x, other.pos.y);
                if(ig.game.units[ig.game.activeUnit] === this) {
                    other.receiveDamage(this.stat.atk-other.stat.def);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                }
                this.destination = this.pos;
                this.path = null;
            }
        }        
    })
});
