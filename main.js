// Main
var BlockSize = 20
var GameFieldPosX = 20
var GameFieldPosY = 20
var GameFieldRows = 20
var GameFieldCols = 10


var $panel
var $currentShapeLaver
var $pitchesShapesLayer

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
      gameController.registerEvent("drop")
    }
    if ( event.which == 37 /*left*/ ) {
      gameController.registerEvent("left")
    }
    if ( event.which == 39 /*right*/ ) {
      gameController.registerEvent("right")
    }
    if ( event.which == 89 /*y*/ ) {
      gameController.registerEvent("rotL")
    }
    if ( event.which == 88 /*x*/ ) {
      gameController.registerEvent("rotR")
    }

    event.preventDefault()
  })

  gameController.start()

})
