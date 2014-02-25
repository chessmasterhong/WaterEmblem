/**
 *  base_player.js
 *  -----
 *  Base player/playable unit. This is an abstract entity that should be
 *  extended.
 */

ig.module(
    'game.entities.abstractities.base_player'
)
.requires(
    'impact.entity',
    'game.entities.misc.pointer',
    'game.entities.misc.tile_dummy',
    'plugins.gridmovement.gridmovement'
)
.defines(function() {
    "use strict";

    ig.global.EntityBase_player = ig.Entity.extend({
        unitType: 'player',
        turnUsed: false,

        // Collision types
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.NEVER,

        size: {x: 32, y: 32},
        init_pos: {x: 0, y: 0},

        // Begin pathfinding and movement properties ---------------------------
        // Enable maximum/limited movement for pathfinding
        maxMovementActive: true,
        pointer: null,
        destination: null,

        // Avoid these entities when pathfinding (must be an array of strings)
        entitiesAvoid: [],

        // Ignore these entities when pathfinding (must be an array of variables)
        entitiesIgnore: [],

        // Movement speed
        maxVel: {x: 256, y: 256},
        speed: 128, // Determines how fast the unit moves in pixels; Not to be confused with the stat.speed
        // End pathfinding and movement properties -----------------------------

        // Begin character development system ----------------------------------
        level: 1,

        // Core stats
        health_max: 10,

        damage: 2,

        stat: {
            // Base stats
            atk: 5, // Attack
            mag: 5, // Magic
            def: 5, // Defense
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

        stat_move_max: 4,
        stat_move_curr: 0,

        tile_index: 0,

        init: function(x, y, settings) {
            this.parent(x, y, settings);

            this.pointer = ig.game.getEntityByName('pointer');

            this.idleTimer = new ig.Timer();
            this.hpBarTimer = new ig.Timer();

            // Begin derived stats calculations --------------------------------
            //this.health_max        = Math.floor(_____);
            //this.stat.phy_dam      = Math.floor(_____);
            //this.stat.mag_dam      = Math.floor(_____);
            //this.stat.phy_def      = Math.floor(_____);
            //this.stat.mag_def      = Math.floor(_____);
            //this.stat.acc          = Math.floor(_____);
            //this.stat.eva          = Math.floor(_____);
            //this.stat.crit         = Math.floor(_____);

            // Resistances
            //this.resist.poison   = Math.floor(_____);
            //this.resist.blind    = Math.floor(_____);
            //this.resist.paralyze = Math.floor(_____);
            //this.resist.daze     = Math.floor(_____);
            //this.resist.sleep    = Math.floor(_____);
            //this.resist.confuse  = Math.floor(_____);
            // End derived stats calculations ----------------------------------

            this.health = this.health_max;
            this.init_pos = this.pos;

            // Load grid movement
            this.movement = new GridMovement(this);
            this.movement.speed = {x: this.speed, y: this.speed};

            // Set maximum pathfinding distance (convert tiles to pixel distance)
            this.maxMovement = this.stat_move_max * ig.global.tilesize - 0.0001; // If set to multiple of tile size, wierd stuff happens when this pathfinding unit aligns to target, so we set it very close to tile size.
        },

        update: function() {
            this.parent();

            // Not in combat mode (ig.game.activeUnit = undefined)
            if(typeof ig.game.activeUnit === 'undefined') {
                // Update grid movement
                this.movement.update();
                if(ig.input.state('up'))         this.movement.direction = GridMovement.moveType.UP;
                else if(ig.input.state('down'))  this.movement.direction = GridMovement.moveType.DOWN;
                else if(ig.input.state('left'))  this.movement.direction = GridMovement.moveType.LEFT;
                else if(ig.input.state('right')) this.movement.direction = GridMovement.moveType.RIGHT;
            // In combat mode and is current active unit
            } else if(ig.game.units[ig.game.activeUnit] === this) {
                // Check if this unit moved for this turn
                if(!this.turnUsed) {
                    // Small timer to prevent instant unit movement (due to user input) when changing active unit to this unit
                    if(this.idleTimer.delta() > 0.2) {
                        // Update grid movement
                        this.movement.update();

                        // Destination not set yet
                        if(this.stat_move_curr < this.stat_move_max) {
                            if(this.destination === null) {
                                // Wait for user's input (keyboard)
                                if(ig.input.state('up') || ig.input.state('down') || ig.input.state('left') || ig.input.state('right')) {
                                    var tile_pos_delta = {x: 0, y: 0};

                                    if(ig.input.state('up')) {
                                        this.currentAnim = this.anims.up;
                                        this.movement.direction = GridMovement.moveType.UP;
                                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y - ig.global.tilesize);
                                        tile_pos_delta.y = -ig.global.tilesize;
                                    } else if(ig.input.state('down')) {
                                        this.currentAnim = this.anims.down;
                                        this.movement.direction = GridMovement.moveType.DOWN;
                                        this.destination = ig.global.alignToGrid(this.pos.x, this.pos.y + ig.global.tilesize);
                                        tile_pos_delta.y = ig.global.tilesize;
                                    } else if(ig.input.state('left')) {
                                        this.currentAnim = this.anims.left;
                                        this.movement.direction = GridMovement.moveType.LEFT;
                                        this.destination = ig.global.alignToGrid(this.pos.x - ig.global.tilesize, this.pos.y);
                                        tile_pos_delta.x = -ig.global.tilesize;
                                    } else if(ig.input.state('right')) {
                                        this.currentAnim = this.anims.right;
                                        this.movement.direction = GridMovement.moveType.RIGHT;
                                        this.destination = ig.global.alignToGrid(this.pos.x + ig.global.tilesize, this.pos.y);
                                        tile_pos_delta.x = ig.global.tilesize;
                                    }

                                    // Get terrain data
                                    var tile_pos = {
                                        x: Math.floor((this.pos.x + ig.global.tilesize / 2 + tile_pos_delta.x) / ig.global.tilesize),
                                        y: Math.floor((this.pos.y + ig.global.tilesize / 2 + tile_pos_delta.y) / ig.global.tilesize)
                                    }

                                    this.tile_index = ig.game.backgroundMaps[1].data[tile_pos.y][tile_pos.x];

                                    // Disallow movement if unit does not enough movement points to move to destination
                                    if(this.stat_move_curr + ig.game.terrain[this.tile_index].move > this.stat_move_max) {
                                        //this.currentAnim = this.anims.idle;
                                        this.movement.direction = null;
                                        this.destination = null;
                                    }
                                }

                                // If user mouse clicked
                                /*if(this.pointer.isClicking) {
                                    // Check if pointer is within this unit's reachable distance this turn
                                    var d = Math.abs(this.pos.x + ig.global.tilesize / 2 - this.pointer.pos.x) + Math.abs(this.pos.y + ig.global.tilesize / 2 - this.pointer.pos.y);
                                    //console.log(d + ' ' + this.maxMovement);
                                    if(d <= ig.global.tilesize / 2) {
                                        this.stat_move_curr = this.stat_move_max;
                                    } else if(d <= Math.round(this.maxMovement) + ig.global.tilesize / 2) {
                                        // Align pointer's position to grid, set as destination, and spawn a dummy entity to assist with pathfinding
                                        this.destination = ig.global.alignToGrid(this.pointer.pos.x, this.pointer.pos.y);
                                        if(this.destination.x !== this.pos.x || this.destination.y !== this.pos.y) {
                                            var dest_entity = ig.game.spawnEntity(
                                                EntityTile_dummy,
                                                this.destination.x,
                                                this.destination.y
                                            );
                                            this.getPath(dest_entity.pos.x, dest_entity.pos.y, false, this.entitiesAvoid, this.entitiesIgnore);
                                            //ig.global.alignToGrid(this.pos.x, this.pos.y);
                                        } else {
                                            this.destination = null;
                                        }
                                    }
                                }*/

                                if(this.stat_move_curr === 0)
                                    this.init_pos = this.pos;
                            // Destination has been set
                            } else {
                                // Destination has been reached
                                if((this.pos.x <= this.destination.x && this.last.x > this.destination.x) ||
                                   (this.pos.x >= this.destination.x && this.last.x < this.destination.x) ||
                                   (this.pos.y <= this.destination.y && this.last.y > this.destination.y) ||
                                   (this.pos.y >= this.destination.y && this.last.y < this.destination.y)) {
                                //if(this.pos.x === this.destination.x && this.pos.y === this.destination.y) {
                                    // Reset destination and advance activeUnit to next unit
                                    this.destination = null;
                                    this.stat_move_curr += ig.game.terrain[this.tile_index].move;

                                    // Keep these for debug purposes for adding new terrains
                                    //console.log("Tile Index: " + this.tile_index + " (x: " + tile_pos.x + ", y: " + tile_pos.y + ")");
                                    //console.log("Terrain Type: " + ig.game.terrain[this.tile_index].type);
                                    //console.log("Movement Cost: " + ig.game.terrain[this.tile_index].move);
                                    //console.log("Defense Bonus: " + ig.game.terrain[this.tile_index].def);
                                    //console.log("Avoid Bonus: " + ig.game.terrain[this.tile_index].avoid);
                                } //else {
                                    //this.followPath(this.speed, true);
                                //}
                            }
                        // If unit used up all their movement points, end their turn
                        } else {
                            // Check if menu exists
                            if(typeof ig.game.getEntityByName('btn_wait') === 'undefined') {
                                // Spawn menu
                                ig.game.spawnEntity(Button, ig.game.screen.x + 75, ig.game.screen.y + 65 , {
                                    name: 'btn_wait',
                                    font: new ig.Font('media/arial.font_14.png'),
                                    text: ['Wait'],
                                    textPos: {x: 37, y: 8},
                                    textAlign: ig.Font.ALIGN.CENTER,
                                    size: {x: 75, y: 23},
                                    animSheet: new ig.AnimationSheet('media/button.png', 75, 23),

                                    pressedDown: function() {
                                        //console.log('Pressed Down');
                                        // Access the proper .turnUsed property on button press
                                        this.init_pos = this.pos;
                                        ig.game.units[ig.game.activeUnit].turnUsed = true;
                                        this.kill();
                                    },

                                    pressed: function() {
                                        //console.log( 'pressed' );
                                        this.init_pos = this.pos;
                                        ig.game.units[ig.game.activeUnit].turnUsed = true;
                                        this.kill();
                                    },

                                    pressedUp: function() {
                                        //console.log( 'pressedUp' );
                                        this.init_pos = this.pos;
                                        ig.game.units[ig.game.activeUnit].turnUsed = true;
                                        this.kill();
                                    }
                                });
                            }

                            //ig.game.getEntityByName('tile_dummy').kill();
                        }
                    }
                }
            // Not unit's turn; reset and hold variables to default value
            } else {
                this.idleTimer.reset();
                this.currentAnim = this.anims.idle;
            }
        },

        clicked: function() {
            ig.game.clickedUnit = this;
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

            /*if(other instanceof EntityBase_enemy) {
                //other.realignToGrid();
                if(ig.game.units[ig.game.activeUnit] === this) {
                    other.receiveDamage(this.damage);
                    console.log(this.name + ' inflicts 1 damage to ' + other.name + '. ' + other.name + ' has ' + other.health + ' hp remaining.');
                    this.turnUsed = true;
                }
            }*/
        },

        draw: function() {
            this.parent();

            // Border/Background
            if(this.health < this.health_max && this.hpBarTimer.delta() < 1) {
                ig.system.context.fillStyle = 'rgb(0, 0, 0)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        (this.init_pos.x - ig.game.screen.x) * ig.system.scale,
                        (this.init_pos.y - ig.game.screen.y - 12) * ig.system.scale,
                        this.size.x * ig.system.scale,
                        6 * ig.system.scale
                    );
                ig.system.context.closePath();
                ig.system.context.fill();

                // Health bar
                ig.system.context.fillStyle = 'rgb(255, 0, 0)';
                ig.system.context.beginPath();
                    ig.system.context.rect(
                        (this.init_pos.x - ig.game.screen.x + 1) * ig.system.scale,
                        (this.init_pos.y - ig.game.screen.y - 11) * ig.system.scale,
                        ((this.size.x - 2) * (this.health / this.health_max)) * ig.system.scale,
                        3 * ig.system.scale
                    );
                ig.system.context.closePath();
                ig.system.context.fill();
            }

            // Available movement tiles
            if((typeof ig.game.units !== 'undefined' && ig.game.units[ig.game.activeUnit] === this && !this.turnUsed && this.idleTimer.delta() > 0.2) && ig.game.clickedUnit === this) {
                var ctx = ig.system.context;
                var mid = this.stat_move_max + 1;

                for(var i = 0; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper left quadrant border tiles
                        ctx.fillRect(
                            this.init_pos.x - (this.stat_move_max - i) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.init_pos.y - i * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower left quadrant border tiles
                        if(i !== 0) {
                            ctx.fillRect(
                                this.init_pos.x - (this.stat_move_max - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y + i * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );
                        }
                    ctx.restore();

                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        for(var j = 1; j <= i; j++) {
                            // Draw upper left quadrant fill tiles
                            ctx.fillRect(
                                this.init_pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower left quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.init_pos.x - (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
                                );
                            }
                        }
                    ctx.restore();
                }

                for(var i = 1; i < mid; i++) {
                    ctx.save();
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        // Draw upper right quadrant border tiles
                        ctx.fillRect(
                            this.init_pos.x + (mid - i) * ig.global.tilesize - ig.game.screen.x + 1,
                            this.init_pos.y - (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                            ig.global.tilesize - 2,
                            ig.global.tilesize - 2
                        );

                        // Draw lower right quadrant border tiles
                        if(i !== 1) {
                            ctx.fillRect(
                                this.init_pos.x + (mid - i) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y + (i - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );
                        }
                    ctx.restore();

                    ctx.save();
                        ctx.fillStyle = 'rgba(0, 0, 255, 0.25)';

                        //ctx.shadowOffsetX = 3;
                        //ctx.shadowOffsetY = 3;
                        //ctx.shadowBlur = 2;
                        //ctx.shadowColor = 'rgba(32, 32, 32, 0.6)';

                        for(var j = 1; j < i; j++) {
                            // Draw upper right quadrant fill tiles
                            ctx.fillRect(
                                this.init_pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                this.init_pos.y - (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                ig.global.tilesize - 2,
                                ig.global.tilesize - 2
                            );

                            // Draw lower right quadrant fill tiles
                            if(j !== 1) {
                                ctx.fillRect(
                                    this.init_pos.x + (i - j) * ig.global.tilesize - ig.game.screen.x + 1,
                                    this.init_pos.y + (j - 1) * ig.global.tilesize - ig.game.screen.y + 1,
                                    ig.global.tilesize - 2,
                                    ig.global.tilesize - 2
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
    });
});
