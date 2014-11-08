fn = require("./fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')


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
})(10,20)

field.set(0,0,"hallo")
assert(field.get(0,0) === "hallo")
field.set(3,4,"roland")
assert(field.get(3,4) === "roland")
field.get(100,100)


var renderFunction = function(w) {
}

var renderWorld = fn.curry(function(renderFunction, w) {
  renderFunction(w)
  console.log("render", w.get(1,1))
  return w
})

var simulateWorld = function(w) {
  console.log("simulate", w.get(1,1))
  return w
}

var performEvents = fn.curry(function(world, eventQueue) {
  return fn.reduce(applyEvent, world, eventQueue)
})

var applyEvent = function applyEvent(world, event) {
  return eventHandler[event](world)
}

var eventHandler = {
  "newShape" : function newShape(world) {
    return world
  },
  "tick" : function tick(world) {
    world.set(1,1,"tick")
    return world
  },
  "left" : function left(world) {
    world.set(2,2,"left")
    return world
  },
  "right" : function right(world) {
    return world
  },
  "rotL" :function rotL(world) {
    return world
  },
  "rotR" : function rotR(world) {
    return world
  },
  "drop" :function drop(world) {
    return world
  }
}

var world = field

var gameLoop = fn.compose(renderWorld(renderFunction), simulateWorld, performEvents(world))

gameLoop(["tick"])
gameLoop(["left"])

console.log("GAME1", world.get(1,1))
console.log("GAME2", world.get(2,2))


fn.compose(g.trace("test"), function(a,b) {return a +"/" + b})("hallo", "world")

console.log("--------------------------------------------")
