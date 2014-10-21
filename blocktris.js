$(document).ready( function() {
    gameController( [
                      new shape(shapeBuilderI,"orange"),
                      new shape(shapeBuilderT,"red"),
                      new shape(shapeBuilderS,"green"),
                      new shape(shapeBuilderZ,"blue"),
                      new shape(shapeBuilderL,"magenta"),
                      new shape(shapeBuilderJ,"brown")
                    ],
                    { elements : [],
                      currentShape : null,
                      stop: false,
                    },
                    $("div#panel"))
})

var GameFieldPosX = 20
var GameFieldPosY = 20

var BlockSize = 20
var GameFieldRows = 20
var GameFieldCols = 10


// +positionBlock :: $div -> x -> y -> $div
var positionBlock = fn.curry(function($div,x,y) {
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
})

// + inGameField :: number -> number -> bool
var inGameField = inRect(GameFieldPosX, GameFieldPosY, GameFieldCols, GameFieldRows)


//+ notInGameField :: number -> number -> bool
var notInGameField = fn.compose(not, inGameField)




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

//+ collision :: game -> bool
var collision = function(game) {
  // TODO
  return false
}

//+ randomShape :: [shape] -> shape
function randomShape(shapes) {
    var mod = shapes.length
    return shapes[rnd(mod)]
}

//+ update :: game -> game
var tick = fn.curry(function(shapes, game) {

  var fall = function(game) {return game.currentShape.move(0,1) }
  var canFall = function(g) { return fn.filter(fn.compose(trace("not in game field"),notInGameField), fall(g).blocks()).length === 0 }
  var fallIfYouCan = iff( function(g) {
                            return assignValidProperty('currentShape', fall(g) ,g)
                        },
                        function(g) {
                            return assignValidProperty('currentShape', randomShape(shapes), g)
                        },
                        fn.compose(trace("canFAll"),canFall))

  // TODO collision with other shapes
  	console.log(game.currentShape.pos.x,game.currentShape.pos.y)
   return fallIfYouCan(game)
// return game
})


function render($panel, game) {
    function drawShapeAt(panel, shape, color) {
        shape.shapeBuilder()[shape.rot].forEach( function(row, idxY, arr) {
            row.forEach( function(col,idxX,arr) {
                if( col !== 0 ) {
                    panel.append( blockAt(idxX + shape.pos.x, idxY + shape.pos.y,color, '.'))
                }
            })
        })
    }

    function updateSpriteByShape(sprite, shape) {
      var shapeCoords = shapeCoordinates(shape.shapeBuilder()[shape.rot])
      var shapeCoordinatesWithOffset = fn.map(zip(add,[shape.pos.x, shape.pos.y]) ,shapeCoords)
      sprite.children().each(function(idx) {
        fn.apply(positionBlock($(this)), shapeCoordinatesWithOffset[idx])
      })
      return sprite
    }

    if($panel.children().size() <= 0) {
      // TODO
      //.... drawAt rendertn nich innerhalb vom div sondern parallel!
      drawShapeAt($panel, game.currentShape, game.currentShape.color)
    } else {
      updateSpriteByShape($panel, game.currentShape)
    }
}

function gameController(shapes, game, viewPanel) {
  var update = []
  // var updateGameWithShapes = updateGame(shapes)
  assignValidProperty('currentShape', randomShape(shapes))(game)
  setInterval(function() { update.push(tick(shapes)) }, 1000)
  setInterval(function() { render(viewPanel, run(update,game))  }, 100)

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
          update.push(function(game) {
            console.log("GAME STOP")
            game.stop = true
            return game
          })

          event.preventDefault()
      }
      if ( event.which == 67 /*c = continue*/ ) {
          update.push(function(game) {
            console.log("CONTINUE")
            game.stop = false
            return game
          })
          // game.continue()
          event.preventDefault()
      }
      if ( event.which == 37 /*left*/ ) {
          update.push(function(game) {
            // TODO left boud!!
            console.log("LEFT")
            game.currentShape = game.currentShape.move(-1,0)
            return game
          })
          // game.left()
          event.preventDefault()
      }
      if ( event.which == 39 /*right*/ ) {
          update.push(function(game) {
            // TODO rigth boud!!
            console.log("RIGHT")
            game.currentShape = game.currentShape.move(1,0)
            return game
          })
          // game.right()
          event.preventDefault()
      }
      if ( event.which == 89 /*y*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape = game.currentShape.rotateClockwise()
            return game
          })
          event.preventDefault()
      }
      if ( event.which == 88 /*x*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape = game.currentShape.rotateCounterClockwise()
            return game
          })
          event.preventDefault()
      }
  })
}
