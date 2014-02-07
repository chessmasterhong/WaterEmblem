/**
 * base_player.js
 * -----
 * Base player/playable unit. This is an abstract entity that should be extended.
 */

ig.module(
    'game.entities.abstractities.base_player'
)
.requires(
    'impact.entity',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_player = ig.Entity.extend({
        unitType: 'party',
        turnUsed: false,

        // Collision types
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.ACTIVE,

        // Set collision size
        size: {x: 32, y: 32},

        // Begin pathfinding and movement properties ---------------------------
        destination: null,

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with the stat.speed
        // End pathfinding and movement properties -----------------------------

        // Begin character development system ----------------------------------
        level: 1,

        // Core stats
        health_max: 10,
        mana_max: 10,
        stamina_max: 10,

        damage: 2,

        stat: {
            // Base stats
            str: 5, // Strength
            int: 5, // Intelligence/Intuition
            //per: 5, // Perception
            //wis: 5, // Wisdom
            wil: 5, // Willpower
            con: 5, // Constitution/Endurance/Vitality
            dex: 5, // Dexterity
            agi: 5, // Agility
            cha: 5, // Charisma
            luk: 5, // Luck

            // Derived stats
            health_regen: 0,  // Health regeneration/degeneration
            mana_regen: 0,    // Mana regeneration/degeneration
            stamina_regen: 0, // Stamina regeneration/degeneration
            action_pts: 0,    // Action points
            phy_dam: 0,       // Physical damage
            mag_dam: 0,       // Magical damage
            phy_def: 0,       // Physical defense
            mag_def: 0,       // Magical defense
            acc: 1,           // Accuracy (hit rate)
            eva: 1,           // Evasion (dodge rate)
            crit_acc: 0,      // Critical accuracy (hit rate)
            crit_eva: 0,      // Critical evasion (dodge rate)
            max_weight: 0,    // Maximum carrying weight
            price_reduct: 0   // Shopping price reduction/increase
        },

        // Resistances
        resist: {
            // Elements
            fire: 0,  // Fire elemental resistance
            water: 0, // Water elemental resistance
            earth: 0, // Earth elemental resistance
            wind: 0,  // Wind elemental resistance
            light: 0, // Light elemental resistance
            dark: 0,  // Dark elemental resistance

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
            health_max: 0, mana_max: 0, stamina_max: 0,
            str: 0, int: 0, wil: 0, con: 0, dex: 0, agi: 0, cha: 0, luk: 0,
            health_regen: 0, mana_regen: 0, stamina_regen: 0, action_pts: 0, phy_dam: 0, mag_dam: 0, phy_def: 0, mag_def: 0, acc: 0, eva: 0, crit_acc: 0, crit_eva: 0, max_weight: 0, price_reduct: 0,
            fire: 0, water: 0, earth: 0, wind: 0, light: 0, dark: 0,
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

        stat_speed: 5,
        stat_move_max: 4,
        stat_move_curr: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.idleTimer = new ig.Timer();
            this.hpBarTimer = new ig.Timer();

            this.health_max        = Math.floor(     this.level * 1 + this.stat.con * 1                         - 1             + this.mod.health_max                                                 );
            //this.stat.health_regen = Math.floor(                      this.stat.con * 0.1                                       + this.mod.health_regen                                               );
            //this.stat.health_degen      = Math.floor(-2 * Number(this.status.isPoisoned)                                        + this.mod.health_degen                                               );
            this.stat.phy_dam      = Math.floor((    this.level * 1 + this.stat.str * 0.5 + this.stat.str * 1   * Math.random() + this.mod.phy_dam     ) / (1 + (1 - Number(this.status.isParalyzed))));
            this.stat.mag_dam      = Math.floor((    this.level * 1 + this.stat.int * 0.5 + this.stat.str * 1   * Math.random() + this.mod.mag_dam     ) / (1 + (1 - Number(this.status.isDazed)))    );
            this.stat.phy_def      = Math.floor(                      this.stat.con * 0.5                                       + this.mod.phy_def                                                    );
            this.stat.mag_def      = Math.floor(                      this.stat.wil * 0.5                                       + this.mod.mag_def                                                    );
            this.stat.acc          = Math.floor((1 - this.level * 1 + this.stat.dex * 1                                         + this.mod.acc         ) / (1 + (1 - Number(this.status.isBlinded)))  );
            this.stat.eva          = Math.floor((1 - this.level * 1 + this.stat.agi * 1                                         + this.mod.eva         ) / (1 + (1 - Number(this.status.isBlinded)))  );
            //this.stat.crit         = Math.floor(                      this.stat.luk * 1                                         + this.mod.crit                                                       );

            // Resistances
            this.resist.fire     = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.25 + this.stat.luk * 0.1  + this.mod.fire    );
            this.resist.water    = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.25 + this.stat.luk * 0.1  + this.mod.water   );
            this.resist.earth    = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.25 + this.stat.luk * 0.1  + this.mod.earth   );
            this.resist.wind     = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.25 + this.stat.luk * 0.1  + this.mod.wind    );
            this.resist.light    = Math.floor(this.stat.wil * 0.1  + this.stat.con * 0.1  + this.stat.luk * 0.25 + this.mod.light   );
            this.resist.dark     = Math.floor(this.stat.wil * 0.1  + this.stat.con * 0.1  + this.stat.luk * 0.25 + this.mod.dark    );
            this.resist.poison   = Math.floor(this.stat.con * 0.75                        + this.stat.luk * 0.1  + this.mod.poison  );
            this.resist.blind    = Math.floor(this.stat.int * 0.75                        + this.stat.luk * 0.1  + this.mod.blind   );
            this.resist.paralyze = Math.floor(this.stat.dex * 0.5  + this.stat.agi * 0.25 + this.stat.luk * 0.1  + this.mod.paralyze);
            this.resist.daze     = Math.floor(this.stat.wil * 0.75                        + this.stat.luk * 0.1  + this.mod.daze    );
            this.resist.sleep    = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.5  + this.stat.luk * 0.1  + this.mod.sleep   );
            this.resist.confuse  = Math.floor(this.stat.int * 0.25 + this.stat.wil * 0.5  + this.stat.luk * 0.1  + this.mod.confuse );

            this.health = this.health_max;

            // Load grid movement
            this.movement = new GridMovement(this);
            this.movement.speed = {x: this.speed, y: this.speed};
        },

        update: function() {
            this.parent();

            // Not in combat mode (ig.game.activeUnit = undefined)
            if(typeof ig.game.activeUnit === 'undefined') {
                // Enable running
                if(ig.input.state('SHIFT'))
                    this.movement.speed = this.maxVel;
                else
                    this.movement.speed = {x: this.speed, y: this.speed};

                // Update grid movement
                this.movement.update();
                if(ig.input.state('up'))         this.movement.direction = GridMovement.moveType.UP;
                else if(ig.input.state('down'))  this.movement.direction = GridMovement.moveType.DOWN;
                else if(ig.input.state('left'))  this.movement.direction = GridMovement.moveType.LEFT;
                else if(ig.input.state('right')) this.movement.direction = GridMovement.moveType.RIGHT;
            // In combat mode and is current active unit
            } else if(ig.game.units[ig.game.activeUnit].name === this.name) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Small timer to prevent instant unit movement (due to user input) when changing active unit to this unit
                    if(this.idleTimer.delta() > 0.2) {
                        // Update grid movement
                        this.movement.update();

                        // Destination not set yet
                        if(this.destination === null) {
                            // Wait for user's input
                            if(ig.input.state('up')) {
                                this.movement.direction = GridMovement.moveType.UP;
                                this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y - ig.global.tilesize);
                            } else if(ig.input.state('down')) {
                                this.movement.direction = GridMovement.moveType.DOWN;
                                this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y + ig.global.tilesize);
                            } else if(ig.input.state('left')) {
                                this.movement.direction = GridMovement.moveType.LEFT;
                                this.destination = ig.global.alignToGrid(this.pos.x - ig.global.tilesize, this.pos.y);
                            } else if(ig.input.state('right')) {
                                this.movement.direction = GridMovement.moveType.RIGHT;
                                this.destination = ig.global.alignToGrid(this.pos.x + ig.global.tilesize, this.pos.y);
                            }
                        // Destination has been set
                        } else {
                            // Destination has been reached
                            if((this.pos.x <= this.destination.x && this.last.x > this.destination.x) ||
                               (this.pos.x >= this.destination.x && this.last.x < this.destination.x) ||
                               (this.pos.y <= this.destination.y && this.last.y > this.destination.y) ||
                               (this.pos.y >= this.destination.y && this.last.y < this.destination.y)) {
                                // Reset destination and advance activeUnit to next unit
                                this.destination = null;
                                this.stat_move_curr++;
                            }
                        }

                        // If unit used up all their movement points, end their turn
                        if(this.stat_move_curr >= this.stat_move_max)
                            this.turnUsed = true;
                    }
                }
            } else {
                this.idleTimer.reset();
            }
        },

        check: function(other) {
            this.parent(other);

            // Grid collision checks
            //this.movement.collision();

            // Lock the unit in place and prevent unit from sliding due to collision
            this.pos = ig.global.alignToGrid(this.last.x, this.last.y);
            this.vel = {x: 0, y: 0};

            this.destination = null;
            this.movement.destination = null;
            this.movement.direction = null;

            if(other instanceof EntityBase_enemy) {
                if(ig.game.units[ig.game.activeUnit].name === this.name) {
                    other.receiveDamage(this.damage);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                    this.turnUsed = true;
                }
            }
        },

        draw: function(){
            this.parent();

            // Border/Background
            if(this.health < this.health_max && this.hpBarTimer.delta() < 1.0) {
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 12) * ig.system.scale,
                    this.size.x * ig.system.scale,
                    6 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Health bar
                ig.system.context.fillStyle = 'rgb(255, 0, 0)';
                ig.system.context.beginPath();
                ig.system.context.rect(
                    (this.pos.x - ig.game.screen.x + 1) * ig.system.scale,
                    (this.pos.y - ig.game.screen.y - 11) * ig.system.scale,
                    ((this.size.x - 2) * (this.health / this.health_max)) * ig.system.scale,
                    3 * ig.system.scale
                );
                ig.system.context.closePath();
                ig.system.context.fill();
            }
            
            // Moveable tiles
            if(typeof ig.game.units !== 'undefined' && ig.game.units[ig.game.activeUnit].name === this.name && !this.turnUsed) {
                var mid = this.stat_move_max + 1 - this.stat_move_curr;
                
                var ctx = ig.system.context;

                for(var i = 0; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';

                        ctx.shadowOffsetX = 3;
                        ctx.shadowOffsetY = 3;
                        ctx.shadowBlur = 2;
                        ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';
                        
                        // Draw upper left quadrant border tiles
                        ctx.fillRect(
                            this.pos.x - (this.stat_move_max - this.stat_move_curr - i) * ig.global.tilesize - ig.game.screen.x,
                            this.pos.y - i * ig.global.tilesize - ig.game.screen.y,
                            ig.global.tilesize,
                            ig.global.tilesize
                        );
                        
                        // Draw lower left quadrant border tiles
                        if(i !== 0) {
                            ctx.fillRect(
                                this.pos.x - (this.stat_move_max - this.stat_move_curr - i) * ig.global.tilesize - ig.game.screen.x,
                                this.pos.y + i * ig.global.tilesize - ig.game.screen.y,
                                ig.global.tilesize,
                                ig.global.tilesize
                            );
                        }
                    ctx.restore();
                    
                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

                        ctx.shadowOffsetX = 3;
                        ctx.shadowOffsetY = 3;
                        ctx.shadowBlur = 2;
                        ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';
                        
                        for(var j = 1; j <= i; j++) {
                            // Draw upper left quadrant fill tiles
                            if(i !== mid - this.stat_move_max + this.stat_move_curr || j !== 1) {
                                ctx.fillRect(
                                    this.pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x,
                                    this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y,
                                    ig.global.tilesize,
                                    ig.global.tilesize
                                );
                            }
                            
                            // Draw lower left quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x,
                                    this.pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y,
                                    ig.global.tilesize,
                                    ig.global.tilesize
                                );
                            }
                        }
                    ctx.restore();
                }
                
                for(var i = 1; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';

                        ctx.shadowOffsetX = 3;
                        ctx.shadowOffsetY = 3;
                        ctx.shadowBlur = 2;
                        ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';
                        
                        // Draw upper right quadrant border tiles
                        ctx.fillRect(
                            this.pos.x + (this.stat_move_max - this.stat_move_curr - i + 1) * ig.global.tilesize - ig.game.screen.x,
                            this.pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y,
                            ig.global.tilesize,
                            ig.global.tilesize
                        );
                        
                        // Draw lower right quadrant border tiles
                        if(i !== 1) {
                            ctx.fillRect(
                                this.pos.x + (this.stat_move_max - this.stat_move_curr - i + 1) * ig.global.tilesize - ig.game.screen.x,
                                this.pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y,
                                ig.global.tilesize,
                                ig.global.tilesize
                            );
                        }
                    ctx.restore();
                    
                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

                        ctx.shadowOffsetX = 3;
                        ctx.shadowOffsetY = 3;
                        ctx.shadowBlur = 2;
                        ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';
                        
                        for(var j = 1; j < i; j++) {
                            // Draw upper right quadrant fill tiles
                            ctx.fillRect(
                                this.pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x,
                                this.pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y,
                                ig.global.tilesize,
                                ig.global.tilesize
                            );
                            
                            // Draw lower right quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x,
                                    this.pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y,
                                    ig.global.tilesize,
                                    ig.global.tilesize
                                );
                            }
                        }
                    ctx.restore();
                }
            }
        },

        receiveDamage: function(amount, from) {
            this.parent(amount);
            this.hpBarTimer.reset();
        },

        kill: function() {
            this.parent();
            this.turnUsed = true;
            console.log(this.name + ' has been defeated.');
        }
    })
});
