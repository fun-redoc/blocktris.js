// Main
var BlockSize
var GameFieldPosX
var GameFieldPosY
var GameFieldRows = 20
var GameFieldCols = 10
var gameFieldRatio = 0.8


var $panel
var $currentShapeLaver
var $pitchesShapesLayer
var $scoreLayer

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

var resizeGame = function() {
      var width = $(window).width()
      var height = $(window).height()

      BlockSize = height * gameFieldRatio / GameFieldRows
      $panel.width(BlockSize*GameFieldCols)
        .height(BlockSize*GameFieldRows)
//        .offset({ top: GameFieldPosY, left:GameFieldPosX} )

      $scoreLayer
        .height($panel.height())
        .width(width*(1-gameFieldRatio))
        .offset({left:GameFieldPosX + $panel.outerWidth()})
}

$(document).ready( function() {

  $panel = $("div#panel")
  $currentShapeLaver = $("div#currentShape")
  $pitchesShapesLayer = $("div#pitchedShapes")
  $scoreLayer =$("div#scoreView")

  GameFieldPosX = $("body").offset().left
  GameFieldPosY = $("body").offset().top

  resizeGame()

  $( window ).resize(resizeGame)

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
