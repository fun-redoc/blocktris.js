var BlockSize = 20
var GameFieldRows = 20
var GameFieldCols = 10


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
})(GameFieldCols,GameFieldRows)


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


var renderWorld = fn.curry(function(dt,renderFunction, w) {
  renderFunction(w)
  return w
})

var simulateWorld = fn.curry(function(dt,w) {
  // console.log("simulate")
  return w
})

var performEvents = fn.curry(function(dt, world, eventQueue) {
  return fn.reduce(applyEvent, world, eventQueue)
})

var applyEvent = fn.curry(function applyEvent(world, event) {
  return eventHandler[event](world)
})

// shape movement in the world
var moveShapeDown = function(world) {
  world.shape = sb.fall(world.shape)
  return world
}

// shape movement in the world
var moveShapeLeft = function(world) {
  world.shape = sb.moveL(world.shape)
  return world
}

// shape movement in the world
var moveShapeRight = function(world) {
  world.shape = sb.moveR(world.shape)
  return world
}

// shape movement in the world
var rotShapeLeft = function(world) {
  world.shape = sb.rotLShape(world.shape)
  return world
}

// shape movement in the world
var rotShapeRight = function(world) {
  world.shape = sb.rotRShape(world.shape)
  return world
}

var eventHandler = {
  "newShape" : function newShape(world) {
    console.log("newShape")
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


var gameController = (function() {
  var updateFunction
  var time
  var id
  var events = []

  return {
           registerEvent: function(evt) {
             events.push(evt)
           },
           stop: function() {
              cancelAnimationFrame(id)
              time = null
           },
           continue: function() {
             this.start(updateFunction)
           },
           start: function(fn) {
             updateFunction = fn || gameLoop()
             function update() {
               id = requestAnimationFrame(update)
                var now = new Date().getTime(),
                dt = now - (time || now);
                time = now;

                updateFunction(events, dt)
                events = []

             }
             update()
           }
        }

})()

var tick = function(intervalLength) {
  var interval = 0
  return function(dt) {
    if(interval < intervalLength) {
      interval += dt
    } else {
      gameController.registerEvent("tick")
      interval = 0
    }
  }
}

var gameLoop = function() {
  var world = {field:field, shape : randomShape()}
  var registerTickEvent = tick(1000)
  return function(events,dt) {
    registerTickEvent(dt)
    world = fn.compose(renderWorld(dt,renderFunction($currentShapeLaver)), simulateWorld(dt), performEvents(dt))(world, events)
  }
}
