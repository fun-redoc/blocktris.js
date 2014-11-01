
// Main
var GameFieldPosX = 20
var GameFieldPosY = 20

var BlockSize = 20
var GameFieldRows = 20
var GameFieldCols = 10


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

//serivces

  // +positionBlock :: $div -> x -> y -> $div
  var positionBlock = fn.curry(function($div,x,y) {
    // whay do i have to add offset coordinates??
    return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
    // return $div.offset({ top: y*BlockSize, left: x*BlockSize })
  })


  //+ randomShape :: [sb.] -> ???
  function randomShape(sbs) {
      var mod = sbs.length
      //not yet clear
      return function() {return sbs[g.rnd(mod)]}
  }

// View Code

  function render($panel, game) {
      if($panel.children().size() <= 0) {
        drawShapeAt($panel, game.currentShape, game.currentShape.color)
      } else {
        updateSpriteByShape($panel, game.currentShape)
      }
  }

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


// Controller Code

  var tick = fn.curry(function(nextShapeMaker) {
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

    var nextShapeMaker = randomShape(shapes)

    var nextTick = tick(nextShapeMaker)
    var updateQueue = [function(game) {
        game.currentShape = nextShapeMaker()
        return game
    }]

    var frame = (function() {
      var time
      var id
      var tickX = function tick1000 (now) {
          var start = start || now
          var duration = 1000
          return function(time,dt) {
            if( start + duration <= time) {
              updateQueue.push(nextTick)
              start = null
              tickX = tick1000(time)
            }
          }
      }(new Date().getTime())

      return {
               stop: function() {
                  cancelAnimationFrame(id)
                  time = null
               },
               start: function() {
                 function update() {
                   id = requestAnimationFrame(update)
                    var now = new Date().getTime(),
                    dt = now - (time || now);
                    time = now;

                    if( updateQueue.length > 0 ) {
                      render($currentShape, g.run(updateQueue,game))
                    }

                    tickX(now,dt)

                 }
                 update()
               }
            }

    })()
    frame.start()

    $(document).keydown(function( event ) {
        //console.log(event.which)
        if ( event.which == 82 /*r = restart*/ ) {
            updateQueue.push(function(game) {
              game.currentShape.startPosition()
              return game
            })
        }
        if ( event.which == 83 /*s = stop*/ ) {
            frame.stop()
        }
        if ( event.which == 67 /*c = continue*/ ) {
            frame.start()
        }
        if ( event.which == 40 /*fall*/ ) {
            updateQueue.push( function(game) {
              var canFall = true
                while(canFall) {
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
                }
                return game
            }
            )
        }
        if ( event.which == 37 /*left*/ ) {
            updateQueue.push(maybeTransformCurrentShape(sb.moveL))
        }
        if ( event.which == 39 /*right*/ ) {
            updateQueue.push(maybeTransformCurrentShape(sb.moveR))
        }
        if ( event.which == 89 /*y*/ ) {
            updateQueue.push(maybeTransformCurrentShape(sb.rotRShape))
        }
        if ( event.which == 88 /*x*/ ) {
            updateQueue.push(maybeTransformCurrentShape(sb.rotLShape))
        }

        event.preventDefault()
    })
  }
