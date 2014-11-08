function World(cols, rows) {

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


    // shape movement in the world
    var moveShapeDown = function(world) {
      shape = maybeTransformCurrentShape(sb.fall)(shape)
      return world
    }

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
      "tick" : moveShapeDown,
      "left" : moveShapeLeft,
      "right" : moveShapeRight,
      "rotL" : rotShapeLeft,
      "rotR" : rotShapeRight,
      "drop" :function drop(world) {
        console.log("drop")
        return world
      }
    }

    World.prototype.applyEvent = fn.curry(function applyEvent(world, event) {
        return eventHandler[event](world)
    })

    World.prototype.shape = function() { return shape }

    return this;
}

