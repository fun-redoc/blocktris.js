var fn = require("./fn.js")
var sb = require("./shapeBuilders.js")


var move = fn.curry(function(x, y, vector) {
  return {x:vector.x + x, y:vector.y + y}
})

var fall = function fall(vector) {
  return {x:vector.x, y:vector.y+1}
}

var fall = function moveL(vector) {
  return {x:vector.x-1, y:vector.y}
}

var fall = function moveR(vector) {
  return {x:vector.x+1, y:vector.y}
}

var rotR = function(vector) {
  return {x:-vector.y, y:vector.x}
}

var rotL = function(vector) {
  return {x:vector.y, y:-vector.x}
}




// console.log(sb.L("red","0").blocks)
// console.log(fn.map(fall,sb.L("red","0").blocks))
console.log(sb.L("red","0").blocks)
// console.log(fn.map(fn.compose(rotL),sb.L("red","0").blocks))
console.log(fn.map(fn.compose(rotL,rotR),sb.L("red","0").blocks))
