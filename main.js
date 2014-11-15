// Main
var BlockSize = 20
var GameFieldPosX = 20
var GameFieldPosY = 20
var GameFieldRows = 20
var GameFieldCols = 10


var $panel
var $currentShapeLaver
var $pitchesShapesLayer

var debugWhenDivAndBlockDiffer = function($div, block) {
            if(!($div.attr("col") == block.x && $div.attr("row") == block.y)) debugger
}

var checkConsistency = function checkConsistency(world) {
    var failures = []
    var shapes = world.getFallenShapes()
    var shapesInDivs = shapes.reduce( function(a,block,i) {
        var res = ($("div[row=" + block.y + "][col=" + block.x + "]").length > 0)
        if(!res) failures.push(block)
        return a && res
    }, true)
    
    if( !shapesInDivs) debugger
    
    var divsInShapes = $("div#pitchedShapes > div[row]").toArray().reduce( function(a, $d, i) {
        var x = $($d).attr("col")
        var y = $($d).attr("row")
        var res = shapes.reduce( function(a,b,i) {
            return a || (b.x == x && b.y == y)}, false)

        if(!res) failures.push($d)
        
        return a && res
    }, true)
    
    if(!divsInShapes) debugger
    
    return world
}


$(document).ready( function() {
  $panel = $("div#panel")
  $currentShapeLaver = $("div#currentShape")
  $pitchesShapesLayer = $("div#pitchedShapes")

  $panel.width(BlockSize*GameFieldCols)
        .height(BlockSize*GameFieldRows)
        .offset({ top: GameFieldPosY, left:GameFieldPosX} )


  $(document).keydown(function( event ) {
    //console.log(event.which)
    if ( event.which == 82 /*r = restart*/ ) {
      gameController.registerEvent("restart")
    }
    if ( event.which == 83 /*s = stop*/ ) {
      gameController.stop()
    }
    if ( event.which == 67 /*c = continue*/ ) {
      gameController.continue()
    }
    if ( event.which == 40 /*fall*/ ) {
      gameController.registerEvent(World.prototype.handlerForEvent("drop"))
    }
    if ( event.which == 37 /*left*/ ) {
      gameController.registerEvent(World.prototype.handlerForEvent("left"))
    }
    if ( event.which == 39 /*right*/ ) {
      gameController.registerEvent(World.prototype.handlerForEvent("right"))
    }
    if ( event.which == 89 /*y*/ ) {
      gameController.registerEvent(World.prototype.handlerForEvent("rotL"))
    }
    if ( event.which == 88 /*x*/ ) {
      gameController.registerEvent(World.prototype.handlerForEvent("rotR"))
    }

    event.preventDefault()
  })

  gameController.start()

})
