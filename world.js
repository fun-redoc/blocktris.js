function World(cols, rows, enqueue, fallenShapeDelegate, moveSprite, removeFromView) {

    var field = (function field(width, height) {
      var w = width
      var h = height
      var arr = [width*height]
      this.get = function(x,y) {
        return arr[y*w + x]
      }
      this.set = function(x,y,v) {
        if( x >= 0 && x < w && y >= 0 && y < h) {
          arr[y*w + x] = v
        }
        return this
      }
      this.width = w
      this.height = h
      return this
    })(cols,rows)

    //+ randomShape :: void -> shape
    var randomShape = function randomShape() {
        var shapes = [
                          sb.I("orange"),
                          sb.T("red"),
                          sb.S("green"),
                          sb.Z("blue"),
                          sb.L("magenta"),
                          sb.J("brown")
                        ]
        var mod = shapes.length
        //not yet clear
        return shapes[g.rnd(mod)]
    }

    var shape = randomShape()
    var fallenShapes = []
    



      // + inGameField :: block -> bool
      var inGameField = function(block) {
        return g.inRect(0, 0, cols, rows, block.x, block.y)
      }

      //+ notInGameField :: a -> bool
      var notInGameField = fn.compose(g.not, inGameField)

      var shapeOutOfField = function(shape){return fn.filter(notInGameField, shape).length !== 0 }

      var shapeValidPositionInGame = function(shape) {
        return !shapeOutOfField(shape) && !sb.intersect( fallenShapes, shape )
      }

      var maybeTransformCurrentShape = fn.curry(function(transformFn, shape) {
        var transformedShape = transformFn(shape)
        if( shapeValidPositionInGame(transformedShape)) {
          return transformedShape
        } else {
            return shape
        }
      })

    var copyShapeToField = function(s) {
        fn.each(function(b) {
            field.set(b.x,b.y,b.color)
        }, s)
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
    var dropRowsNecessary = false
    var droppedRows = fn.map( function(v) {
      if( v === expectedRowSum ) {
        dropRowsNecessary = true
        return true
      }
      return false
    }, rowSumsArr)
    
    if(!dropRowsNecessary) return field

    var rowsToDrop =
      fn.compose(
          fn.reverse,
//		      g.trace("afer get"),
		      g.get("movesPerRow"),
//		      g.trace("after reduce"),
              g.reduce(function(a,v,i) {
                   a.movesPerRow[i] = a.maxMoves
                   if(v) {a.maxMoves++}
                   return a
              },{movesPerRow:[], maxMoves:0 }),
//          g.trace("bevore reduce"),
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
    
      var fieldWithHolesSortedDescendingByRow = fieldWithHoles.sort( function(b1,b2) {
          if( b1.y > b2.y ) return -1
          if( b1.y < b2.y ) return 1
          return 0
      })
    
      var shrunkField = fn.reduce(
        function(a,v,i) {
          var row = v.y
          var rowsToMove = rowsToDrop[row] || 0
          var blockToMove = g.copy(v)
          blockToMove.y += rowsToMove
          if( rowsToMove > 0 ) {
            var $div = moveHandler(v,blockToMove)
//            debugWhenDivAndBlockDiffer($div, blockToMove)
          }
          return a.concat(blockToMove)
        }, [], fieldWithHolesSortedDescendingByRow)

      return shrunkField
})
    
    
    var shrinkField = function(world) {
        var lastRowComplete = someRowComplete(removeFromView,
                                            moveSprite,
                                            cols,
                                            fallenShapes)
        fallenShapes = lastRowComplete
        checkConsistency(world)
        return world
    }


    // shape movement in the world
    var moveShapeDown = fn.curry(function(repeat, world) {
        var canFall = true
        // TODO instead of active fall in better use an animation which works async
        while(canFall) {
          var fallenShape = sb.fall(g.copy(shape))
          canFall = shapeValidPositionInGame(fallenShape)
          if(canFall) {
              shape = fallenShape;
          } else {
              var droppedShape = g.copy(shape)
              fallenShapes = fallenShapes.concat(droppedShape)
              copyShapeToField(droppedShape)
              fallenShapeDelegate(shape, droppedShape);
              world = shrinkField(world); 
              shape = randomShape();
          }
          canFall = canFall && (repeat || false)
        }
        return world
    })

    // shape movement in the world
    var moveShapeLeft = function(world) {
      shape = maybeTransformCurrentShape(sb.moveL)(shape)
      return world
    }

    // shape movement in the world
    var moveShapeRight = function(world) {
      shape = maybeTransformCurrentShape(sb.moveR)(shape)
      return world
    }

    // shape movement in the world
    var rotShapeLeft = function(world) {
      shape = maybeTransformCurrentShape(sb.rotLShape)(shape)
      return world
    }

    // shape movement in the world
    var rotShapeRight = function(world) {
      shape = maybeTransformCurrentShape(sb.rotRShape)(shape)
      return world
    }

    var eventHandler = {
      "newShape" : function newShape(world) {
//        console.log("newShape")
        shape = randomShape()
        return world
      },
      "tick" : moveShapeDown(false),
      "left" : moveShapeLeft,
      "right" : moveShapeRight,
      "rotL" : rotShapeLeft,
      "rotR" : rotShapeRight,
      "drop" : moveShapeDown(true)
    }

    World.prototype.handlerForEvent = function(evt) {
        return eventHandler[evt]
    }
    
    World.prototype.applyEvent = fn.curry(function applyEvent(world, event) {
        return World.prototype.handlerForEvent(event)(world)
    })

    World.prototype.shape = function() { return shape }
    World.prototype.field = function() { return field }
    World.prototype.getFallenShapes = function() {
        return fallenShapes
    }


    return this;
}

