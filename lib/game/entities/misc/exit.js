/***********************************************************************
  Exit
  ====
  A map transition entity that enables the player to traverse through
  the world via sub-maps.
***********************************************************************/

ig.module(
    'game.entities.misc.exit'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function() {
    EntityExit = ig.Entity.extend({
        //type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,

        // The exit entity doesn't have graphics, so we create a box
        // that is displayed within Weltmeister to represent this entity.
        // Tell Weltmeister how to render the object inside edit view.
        // The following draws a blue 8x8 resizable box.
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        _wmDrawBox: true,
        _wmScalable: true,
        size: {x: 8, y: 8},

        // Set level and direction to null (set in Weltmeister)
        level: null,
        direction: null,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            var new_pos = {x: null, y: null};
        },

        // Override update method and remove this.parent() so as not to
        // waste render cycles drawing an entity with no graphics.
        update: function() {},

        check: function(other) {
            // If player collides with this entity, move to destination
            // map specified by 'this.map' and 'this.direction'.
            if(other instanceof EntityPlayer) {
                if(this.level !== null && this.direction !== null) {
                    var mapSize = this.getMapSize();
                    var tilesize = ig.game.collisionMap.tilesize;
                    var new_pos = (this.direction === 'north' && ig.input.state('up'))     ?  {x: other.pos.x,              y: mapSize.y - tilesize * 2} :
                                  (this.direction === 'south' && ig.input.state('down'))   ?  {x: other.pos.x,              y: tilesize} :
                                  (this.direction === 'west'  && ig.input.state('left'))   ?  {x: mapSize.x - tilesize * 2, y: other.pos.y} :
                                  (this.direction === 'east'  && ig.input.state('right'))  && {x: tilesize,                 y: other.pos.y};
                    ig.game.director.loadLevel(this.level);
                    //ig.game.spawnEntity(EntityPlayer, new_pos.x, new_pos.y);
                    player = ig.game.getEntitiesByType('EntityPlayer')[0];
                    player.pos = {x: new_pos.x, y: new_pos.y};
                }
            }
        },

        getMapSize: function() {
            var map = ig.game.collisionMap;
            var tilesize = map.tilesize;
            var mapWidth = map.width * tilesize;
            var mapHeight = map.height * tilesize;
            return {x: mapWidth, y: mapHeight};
        }
    }) // End EntityExit
}); // End .defines
