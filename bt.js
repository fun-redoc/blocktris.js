fn = require("./fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")

var shape = sb.L("red")
var clone = g.copy(shape)

console.log(shape.center == shape.blocks[1])
console.log(shape == clone)
console.log(clone.center == clone.blocks[1])

console.log("--------------------------------------------")
