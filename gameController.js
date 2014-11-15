
var renderWorld = fn.curry(function(dt,renderFunction, w) {
  renderFunction(w)
  return w
})

var simulateWorld = fn.curry(function(dt,w) {
  // console.log("simulate")
  return w
})

var performEvents = fn.curry(function(dt, world, eventQueue) {
  return fn.reduce(function(accuWorld, eventHandler) { return eventHandler(accuWorld) } , world, eventQueue)
})

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

                var eventsToExecute = g.copy(events)
                events = []
                updateFunction(eventsToExecute, dt)

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
      gameController.registerEvent(World.prototype.handlerForEvent("tick"))
      interval = 0
    }
  }
}


var gameLoop = function() {
  var registerTickEvent = tick(1000)
  var world = new World(GameFieldCols, GameFieldRows,
                        gameController.registerEvent,
                        function(startShape, dropShape) {
                            // TODO animante transition
                            drawShapeAt($pitchesShapesLayer, dropShape, dropShape.color)
                            checkConsistency(world)
                        },
                       moveSprite($pitchesShapesLayer)    ,
                       removeFromView($pitchesShapesLayer))
  return function(events,dt) {
    registerTickEvent(dt)
    world = fn.compose(checkConsistency, renderWorld(dt,renderFunction()), simulateWorld(dt), performEvents(dt))(world, events)
    
  }
}
