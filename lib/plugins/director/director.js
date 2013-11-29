ig.module(
	'plugins.director.director'
)
.requires(
	'impact.impact'
)
.defines(function(){

ig.Director = ig.Class.extend({
  //Initialize the class with game representing the main game object
  //and levels being an array of level objects.
  //The first level in the array is loaded by default.
  init: function(theGame, initialLevels){
    this.game = theGame;
    this.levels = [];
    this.currentLevel = 0;
    this.append(initialLevels);
    return this.loadLevel(this.currentLevel);
  },

  loadLevel: function(levelNumber){
    //Load a level by its position in this.levels array
    //and set the this.currentLevel to that position.
    this.currentLevel = levelNumber;
    this.game.loadLevel( this.levels[levelNumber] );
    return true;
  },
  
  append: function(levels){
    //Append a single new level or an array of new levels.
    newLevels = [];
    if (typeof(levels) === 'object'){
      if (levels.constructor === (new Array).constructor){
        newLevels = levels;
      }
      else{
        newLevels[0] = levels;
      }
      this.levels = this.levels.concat(newLevels);
      return true;
    }
    else{
      return false;
    }
  },

  nextLevel: function(){
    //Advance to the next level provided we are not at 
    //the end of the array.
    if (this.currentLevel + 1 < this.levels.length){
      return this.loadLevel(this.currentLevel + 1);
    }
    else{
      return false;
    }
  },

  previousLevel: function(){
    //Go back one level provided we are not at the begining of
    //the array.
    if (this.currentLevel - 1 >= 0){
      return this.loadLevel(this.currentLevel - 1);
    }
    else{
      return false;
    }
  },

  jumpTo: function(requestedLevel){
    //requestedLevel needs to be a level object. First see if
    //requested level is in the this.levels array. If so, load it
    //otherwise return false.
    var levelNumber = null;
    for(i=0; i < this.levels.length; i++) {
      if (this.levels[i] == requestedLevel){
        levelNumber = i;
      }
    }    
    if (levelNumber >= 0){
      return this.loadLevel(levelNumber);
    }
    else{
      return false;
    }
  },

  firstLevel: function(){
    //Go to the first level.
    return this.loadLevel(0);
  },

  lastLevel: function(){
    //Go to the last level.
    return this.loadLevel(this.levels.length - 1);
  },

  reloadLevel: function(){
    //Reset the current level.
    return this.loadLevel(this.currentLevel);
  }

});

});

