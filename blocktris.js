
$(document).ready( function() {
    $("div#panel")
      .width(BlockSize*GameFieldCols)
      .height(BlockSize*GameFieldRows)
      .offset({ top: GameFieldPosY, left:GameFieldPosX} )

    gameController( [
                      sb.I("orange"),
                      sb.T("red"),
                      sb.S("green"),
                      sb.Z("blue"),
                      sb.L("magenta"),
                      sb.J("brown")
                    ],
                    $("div#currentShape"),
                    $("div#pitchedShapes"))
})

var GameFieldPosX = 20
var GameFieldPosY = 20

var BlockSize = 20
var GameFieldRows = 10
var GameFieldCols = 10

// +positionBlock :: $div -> x -> y -> $div
var positionBlock = fn.curry(function($div,x,y) {
	// whay do i have to add offset coordinates??
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
  // return $div.offset({ top: y*BlockSize, left: x*BlockSize })
})

// + inGameField :: block -> bool
var inGameField = function(block) {
  return g.inRect(0, 0, GameFieldCols, GameFieldRows, block.x, block.y)
}


//+ notInGameField :: a -> bool
var notInGameField = fn.compose(g.not, inGameField)

var shapeOutOfField = function(shape){return fn.filter(notInGameField, shape).length !== 0 }

var shapeValidPositionInGame = function(game, shape) {
  return !shapeOutOfField(shape) && !sb.intersect( game.fallenShapes, shape )
}

var maybeTransformCurrentShape = fn.curry(function(transformFn, game) {
  var rotShape = transformFn(game.currentShape)
  if( shapeValidPositionInGame(game, rotShape)) {
    game.currentShape = rotShape
  }
  return game
})

function blockAt(col, row, color,mark) {
    var $block =  $("<div/>")
        .addClass("block")
        .css({backgroundColor: color})
        .width(BlockSize)
        .height(BlockSize)
	// why do i have to leave out the offst coordinates???
        .offset({ top: row*BlockSize, left: col*BlockSize})
        // .offset({ top: row*BlockSize + GameFieldPosY, left: col*BlockSize + GameFieldPosX})
        .html(mark)

    return $block
    // return positionBlock($block, col, row)
}

// function blockMoveBy($div, x,y) {
//   $div.offset({ top: $div.offset().top + y*BlockSize, left: $div.offset().left + x*BlockSize})
//   return $div
// }

    function drawShapeAt(panel, shape) {
        fn.each( function(pair) {
            panel.append( blockAt(pair.x, pair.y,pair.color, '.'))
        },shape)
    }

    function updateSpriteByShape($panel, shape) {
      $panel.children().each(function(idx) {
        positionBlock($(this), shape[idx].x,shape[idx].y)
      })
      return $panel
    }



//+ randomShape :: [sb.] -> ???
function randomShape(sbs) {
    var mod = sbs.length
    //not yet clear
    return function() {return sbs[g.rnd(mod)]}
}


function gameController(shapes, $currentShape, $pitchedShapes) {
  var game = {
                fallenShapes : [],
                currentShape : null,
                dropShapeObeservers : [],
	  dropShapeNotification : function(shape) {
	  				         fn.each(function(observer){ observer(shape) }, this.dropShapeObeservers)
  				      }
             }

  game.dropShapeObeservers.push(function(shape) {
    drawShapeAt($pitchedShapes, shape, shape.color)
  })

  var update = []
  var nextShapeMaker = randomShape(shapes)
  game.currentShape = nextShapeMaker()
  var nextTick = tick(nextShapeMaker)
  var frame = (function() {
    var tickTimer
    var frameTimer

    return {stop: function() {
                    clearInterval(tickTimer)
                    clearInterval(frameTimer)
             },
             start: function() {
                      tickTimer = setInterval(function() { update.push(nextTick) }, 1000)
                      frameTimer = setInterval(function() { render($currentShape, g.run(update,game))  }, 100)
             }
          }

  })()

  frame.start()

  $(document).keydown(function( event ) {
      //console.log(event.which)
      if ( event.which == 82 /*r = restart*/ ) {
          update.push(function(game) {
            game.currentShape.startPosition()
            return game
          })
          event.preventDefault()
      }
      if ( event.which == 83 /*s = stop*/ ) {
          frame.stop()
          event.preventDefault()
      }
      if ( event.which == 67 /*c = continue*/ ) {
          frame.start()
          event.preventDefault()
      }
    if ( event.which == 40 /*fall*/ ) {
          update.push(function(game) {
            // TODO left boud!!
            // console.log("FALL")
            game.currentShape = sb.fall(game.currentShape)
            return game
          })
          // game.left()
          event.preventDefault()
      }
      if ( event.which == 37 /*left*/ ) {
          update.push(maybeTransformCurrentShape(sb.moveL))
          //   function(game) {
          //   var movedShape = sb.moveL(game.currentShape)
          //   if( shapeValidPositionInGame(game,movedShape) ) {
          //     game.currentShape =  movedShape
          //   }
          //   return game
          // })
          // game.left()
          event.preventDefault()
      }
      if ( event.which == 39 /*right*/ ) {
          update.push(maybeTransformCurrentShape(sb.moveR))
          //   function(game) {
          //   var movedShape = sb.moveR(game.currentShape)
          //   if( shapeValidPositionInGame(game,movedShape) ) {
          //     game.currentShape =  movedShape
          //   }
          //   return game
          // })
          // game.right()
          event.preventDefault()
      }
      if ( event.which == 89 /*y*/ ) {
          update.push(maybeTransformCurrentShape(sb.rotRShape))
          event.preventDefault()
      }
      if ( event.which == 88 /*x*/ ) {
          update.push(maybeTransformCurrentShape(sb.rotLShape))
          event.preventDefault()
      }
  })
}



function render($panel, game) {
    if($panel.children().size() <= 0) {
      drawShapeAt($panel, game.currentShape, game.currentShape.color)
    } else {
      updateSpriteByShape($panel, game.currentShape)
    }
}


var tick = function(nextShapeMaker) {
  return function(game) {
    var fallenShape = sb.fall(g.copy(game.currentShape))
    var canFall = shapeValidPositionInGame(game, fallenShape)
    if(canFall) {
        game.currentShape = fallenShape;
    } else {
        // put color into each block!!
        var droppedShape = g.copy(game.currentShape)
        // TODO make fallen shapes flatt, to avoid flatten in the intersection
        game.fallenShapes.push(droppedShape)
        game.dropShapeNotification(droppedShape)
        game.currentShape = nextShapeMaker();
    }
    return game
  }
}
