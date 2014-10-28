
$(document).ready( function() {
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
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
})

// + inGameField :: block -> bool
var inGameField = function(block) {
  return g.inRect(0, 0, GameFieldCols, GameFieldRows, block.x, block.y)
}


//+ notInGameField :: a -> bool
var notInGameField = fn.compose(g.not, inGameField)


function blockAt(col, row, color,mark) {
    var $block =  $("<div/>")
        .addClass("block")
        .css({backgroundColor: color})
        .width(BlockSize)
        .height(BlockSize)
        .offset({ top: row*BlockSize + GameFieldPosY, left: col*BlockSize + GameFieldPosX})
        .html(mark)
    return $block
}

function blockMoveBy($div, x,y) {
  $div.offset({ top: $div.offset().top + y*BlockSize, left: $div.offset().left + x*BlockSize})
  return $div
}

    function drawShapeAt(panel, shape) {
        fn.each( function(pair) {
            panel.append( blockAt(pair.x, pair.y,shape.color, '.'))
        },shape.blocks)
    }

    function updateSpriteByShape($panel, shape) {
      $panel.children().each(function(idx) {
        positionBlock($(this), shape.blocks[idx].x,shape.blocks[idx].y)
      })
      return $panel
    }



//+ collision :: game -> bool
var collision = function(game) {
  // TODO
  return false
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
                      tickTimer = setInterval(function() { update.push(nextTick(game.currentShape)) }, 1000)
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
          update.push(function(game) {
            // TODO left boud!!
            // console.log("LEFT")
            game.currentShape = sb.moveL(game.currentShape)
            return game
          })
          // game.left()
          event.preventDefault()
      }
      if ( event.which == 39 /*right*/ ) {
          update.push(function(game) {
            // TODO rigth boud!!
            // console.log("RIGHT")
            game.currentShape = sb.moveR(game.currentShape)
            return game
          })
          // game.right()
          event.preventDefault()
      }
      if ( event.which == 89 /*y*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape = sb.rotRShape(game.currentShape)
            return game
          })
          event.preventDefault()
      }
      if ( event.which == 88 /*x*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape = sb.rotLShape(game.currentShape)
            return game
          })
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


//+ tick :: (fn :: [shapes] -> shape) -> shape -> (fn :: game -> game)
var tick = fn.curry(function(nextShapeMaker, currentShape) {

  var fallenShape = sb.fall(g.copy(currentShape))

  var canFall = fn.filter(notInGameField, fallenShape.blocks).length === 0

  //TODO check if there are shared blocks in tthe pithed array and fall black

  return canFall ?
          function(game) {
              game.currentShape = fallenShape; return game
          } :
          function(game) {
                   var droppedShape = g.copy(game.currentShape)
                   game.fallenShapes.push(droppedShape)
                   game.dropShapeNotification(droppedShape)
                   game.currentShape = nextShapeMaker(); return game
          }
  // TODO collision with other shapes
})
