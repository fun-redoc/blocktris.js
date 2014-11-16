
var renderWorld = fn.curry(function(dt,renderFunction, w) {
  renderFunction(w)
  return w
})


var simulateWorld = fn.curry(function(dt, world, eventQueue) {
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

function Scoring() {
    var level = 1
    var points = 0

    var countPoints = function countPoints(completedRows) {
        points = completedRows.reduce( function(a,v) {
            return a + v*level
        }, points )
    }

    Scoring.prototype.countPoints = countPoints
    Scoring.prototype.getLevel = function() {
        return level
    }
    Scoring.prototype.getPoints = function() {
        return points
    }
    Scoring.prototype.nextLevel = function() {
        level += 1
    }
}
var gameLoop = function() {
  var registerTickEvent = tick(1000)
  var scoring = new Scoring()
  var world = new World(GameFieldCols, GameFieldRows, scoring.countPoints)
  return function(events,dt) {
    registerTickEvent(dt)
    world = fn.compose(checkConsistency, renderWorld(dt,renderFunction()), simulateWorld(dt))(world, events)
//    renderScoring(scoring)
  }
}
