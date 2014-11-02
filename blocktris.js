
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

var rowSums = function rowSums(field) { return fn.reduce( function(accu, val ) {
    var valX = val.x  + 1
    if( accu[val.y] ) {
      accu[val.y] += valX
    } else {
      accu[val.y] = valX
    }
    return accu
  }, [], field)
}

//+ someRowComplete :: (removeHandler :: block -> void) -> (moveHandler :: block -> block -> void) -> field -> field
var someRowComplete = fn.curry(
  function someRowComplete(removeHandler, moveHandler, maxColNumber, field) {
    // IDEA: sum of als Blocks x coordinates [1..maxColNumber] must be sum(1..MaxColNumber) otherwise the row is not complettly filled
    var rowSumsArr = rowSums(field)
    var expectedRowSum = g.gausSum(maxColNumber)
    var droppedRows = fn.map( function(v) {
      if( v === expectedRowSum ) {
        return true
      }
      return false
    }, rowSumsArr)

    var rowsToDrop =
      fn.compose(
          fn.reverse,
		      g.trace("afer get"),
		      g.get("movesPerRow"),
		      g.trace("after reduce"),
          g.reduce(
            function(a,v,i) {
              a.movesPerRow[i] = (a.movesPerRow[i] || 0 ) + a.maxMoves
              if(v) {a.maxMoves++}
              return a
            },
            {movesPerRow:[], maxMoves:0 }),
          g.trace("bevore reduce"),
          fn.reverse)(droppedRows)


    var fieldWithHoles = fn.filter(
      function(block) {
        var row = block.y
        if( rowSumsArr[row] === expectedRowSum ) {
          removeHandler(block)
          return false
        }
        return true
      }, field )


      var shrunkField = fn.reduce(
        function(a,v,i) {
          var row = v.y
          var rowsToMove = rowsToDrop[row] || 0
          var blockToMove = g.copy(v)
          blockToMove.y += rowsToMove
          if( rowsToMove ) {
            moveHandler(v,blockToMove)
          }
          return a.concat(blockToMove)
        }, [], fieldWithHoles)

      return shrunkField
})

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
          .attr("col", col)
          .attr("row", row)
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
      $(this).attr("col", shape[idx].x).attr("row", shape[idx].y)
    })
    return $panel
  }

var moveSprite = fn.curry(function moveSprite($panel, fromBlock, toBlock) {
    var col = fromBlock.x
    var row = fromBlock.y
    $div = $("div[row=" + row + "][col=" + col + "]")
    positionBlock($div, toBlock.x, toBlock.y)
    $div.attr("row", toBlock.y).attr("col",toBlock.x)
    // TODO some animation (fly away in random direction - ballistically)
})


  var removeFromView = fn.curry(function removeFromView($pitchedShapesView, block) {
      var col = block.x
      var row = block.y
      $div = $("div[row=" + row + "][col=" + col + "]")
      // TODO some animation (fly away in random direction - ballistically)
      $div.remove()
  })


// Controller Code


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

    game.dropShapeObeservers.push(function drawPitchedSahpes(shape) {
      drawShapeAt($pitchedShapes, shape, shape.color)
    })

    game.dropShapeObeservers.push(function dropCompletedBottomRow(shape) {
      var lastRowComplete = someRowComplete(removeFromView($pitchedShapes),
                                            moveSprite($pitchedShapes),
                                            GameFieldCols,
                                            game.fallenShapes)
      game.fallenShapes = lastRowComplete
    })


    var nextShapeMaker = randomShape(shapes)

    var nextTick = tick(nextShapeMaker, false)
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
            updateQueue.push( tick(nextShapeMaker, true))
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


var tick = fn.curry(function(nextShapeMaker, repeat) {
  return function(game) {
    var canFall = true
    while(canFall) {
      var fallenShape = sb.fall(g.copy(game.currentShape))
      canFall = shapeValidPositionInGame(game, fallenShape)
      if(canFall) {
          game.currentShape = fallenShape;
      } else {
          // put color into each block!!
          var droppedShape = g.copy(game.currentShape)
          // TODO make fallen shapes flatt, to avoid flatten in the intersection
          game.fallenShapes = game.fallenShapes.concat(droppedShape)
          game.dropShapeNotification(droppedShape)
          game.currentShape = nextShapeMaker();
      }
      canFall = canFall && repeat
    }
    return game
  }
})
