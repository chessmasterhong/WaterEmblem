/***********************************************************************
  Impact Grid Movement Plugin
  ===========================
  Plugin Author: Tyler Deren (ITyl)
  Plugin Source: https://github.com/lTyl/impact-grid-movement
  Licence: WTFPL license (http://www.wtfpl.net)

  Original Author: Jonathan Commins (Joncom)
  Original Source: https://github.com/Joncom/impact-grid-movement

  - Top-down perspective
  - 4-directional movement
  - Camera follows target entity
  - Align to grid when not moving
  - Move smoothly (not teleport) between tiles
  - Only "snap" to grid as much as necessary
  - Entity-on-Entity collision support

  Modifications:
  - Random chance of combat encounters
***********************************************************************/

ig.module(
    'plugins.gridmovement.gridmovement'
)
.requires(
    'impact.impact'
)
.defines(function() {
    GridMovement = ig.Class.extend({
        direction: null,
        lastMove: null,
        destination: null,
        entity: null,
        lastTile: {},
        align: true,
        speed: {x: 128, y: 128},

        init: function(entity) {
            this.entity = entity;
        },

        update: function() {
            if(this.align) {
                var tile = this.getCurrentTile();
                this.snapToTile(Math.floor(tile.x), Math.floor(tile.y));
                this.align = false;
            }

            // Stop if at destination
            if(this.isMoving() && this.justReachedDestination() && !this.direction) {
                this.stopMoving();
                // temp
            // Stop moving if hitting a wall
            } else if(this.isMoving() && this.justReachedDestination() && this.direction && !this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.direction)) {
                this.stopMoving();
            // Dest reached, but set a new dest and continue
            } else if(this.isMoving() && this.justReachedDestination() && this.direction && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.direction) && this.direction === this.lastMove) {
                this.continueMovingFromDestination();
            // Dest reached but changing direction
            } else if(this.isMoving() && this.justReachedDestination() && this.direction && this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.direction) && this.direction !== this.lastMove) {
                this.changeDirectionAndContinueMoving(this.direction);
                // temp
            // Dest not reached, continue
            } else if(this.isMoving() && !this.justReachedDestination()) {
                this.continueMovingToDestination();
            // Not moving, start moving
            } else if(!this.isMoving() && this.direction && this.canMoveDirectionFromCurrentTile(this.direction)) {
                this.startMoving(this.direction);
            }

            this.direction = null;
            this.lastTile = this.destination;
        },

        collision: function() {
            if(this.lastTile !== null)
                this.snapToTile(this.lastTile.x, this.lastTile.y);
            this.entity.vel = {x: 0, y: 0};
            this.direction = null;
            this.destination = null;
            this.lastMove = null;
        },

        getCurrentTile: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var tileX = this.entity.pos.x / tilesize;
            var tileY = this.entity.pos.y / tilesize;
            return {x: tileX, y: tileY};
        },

        getTileAdjacentToTile: function(tileX, tileY, direction) {
            if(direction === GridMovement.moveType.UP)         tileY += -1;
            else if(direction === GridMovement.moveType.DOWN)  tileY +=  1;
            else if(direction === GridMovement.moveType.LEFT)  tileX += -1;
            else if(direction === GridMovement.moveType.RIGHT) tileX +=  1;
            return {x: tileX, y: tileY};
        },

        startMoving: function(direction) {
            // Get current tile position.
            var currTile = this.getCurrentTile();
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        continueMovingToDestination: function() {
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        continueMovingFromDestination: function() {
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, this.lastMove);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        changeDirectionAndContinueMoving: function(newDirection) {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // Get new destination.
            this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
            // Move.
            this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        },

        stopMoving: function() {
            // Method only called when at destination, so snap to it now.
            this.snapToTile(this.destination.x, this.destination.y);
            // We are already at the destination.
            this.destination = null;
            // Stop.
            this.entity.vel.x = this.entity.vel.y = 0;
        },

        snapToTile: function(x, y) {
            var tilesize = ig.game.collisionMap.tilesize;
            this.entity.pos.x = x * tilesize;
            this.entity.pos.y = y * tilesize;
        },

        justReachedDestination: function() {
            var tilesize = ig.game.collisionMap.tilesize;
            var destinationX = this.destination.x * tilesize;
            var destinationY = this.destination.y * tilesize;
            return ((this.entity.pos.x >= destinationX && this.entity.last.x < destinationX) ||
                    (this.entity.pos.x <= destinationX && this.entity.last.x > destinationX) ||
                    (this.entity.pos.y >= destinationY && this.entity.last.y < destinationY) ||
                    (this.entity.pos.y <= destinationY && this.entity.last.y > destinationY));
        },

        isMoving: function() {
            return this.destination !== null;
        },

        canMoveDirectionFromTile: function(tileX, tileY, direction) {
            var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
            return ig.game.collisionMap.data[Math.round(newPos.y)][Math.round(newPos.x)] === 0;
        },

        canMoveDirectionFromCurrentTile: function(direction) {
            var currTile = this.getCurrentTile();
            return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
        },

        setVelocityByTile: function(tileX, tileY) {
            var tilesize      = ig.game.collisionMap.tilesize;
            var tileCenterX   = tileX * tilesize + tilesize / 2;
            var tileCenterY   = tileY * tilesize + tilesize / 2;
            var entityCenterX = this.entity.pos.x + this.entity.size.x / 2;
            var entityCenterY = this.entity.pos.y + this.entity.size.y / 2;

            this.entity.vel.x = this.entity.vel.y = 0;

            if(entityCenterX > tileCenterX)      this.entity.vel.x = -this.speed.x;
            else if(entityCenterX < tileCenterX) this.entity.vel.x =  this.speed.x;
            else if(entityCenterY > tileCenterY) this.entity.vel.y = -this.speed.y;
            else if(entityCenterY < tileCenterY) this.entity.vel.y =  this.speed.y;
        }
    });

    GridMovement.moveType = {
        'UP'   : 1,
        'DOWN' : 2,
        'LEFT' : 4,
        'RIGHT': 8
    };
});