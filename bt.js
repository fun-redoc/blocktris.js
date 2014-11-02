fn = require("./fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')


var shape = sb.L("red")
var clone = g.copy(shape)

var block1 = {x:'1', y:'1'}
var block2 = {x:'1', y:'1'}
var block3 = {x:'2', y:'1'}
var block4 = {x:'2', y:'2'}
var block5 = {x:'3', y:'2'}
var block6 = {x:'4', y:'5'}
var block7 = {x:'5', y:'6'}
var shape = [block2, block3]
var shape2 = [block2, block4]
var shape3 = [block5, block4]
var shape4 = [block6, block7]
var array_of_shapes = [shape2,shape3]

// console.log(flatten(array_of_shapes))

assert.deepEqual(g.flatten(array_of_shapes),fn.concat(block2,block4,block5,block4))

assert(g.equal2D(block1,block2))
assert.notEqual(g.equal2D(block1,block3))

assert(g.contains(g.equal2D, shape, block2))
assert.notEqual(g.contains(g.equal2D, shape, block4))

assert(g.intersect(g.equal2D, shape, shape2))
assert(g.intersect(g.equal2D, shape2, shape))
assert(g.intersect(g.equal2D, shape, block2))
assert(g.intersect(g.equal2D, shape, block1))
assert.notEqual(g.intersect(g.equal2D, shape3, shape2))
assert.notEqual(g.intersect(g.equal2D, shape3, shape))

assert.notEqual(sb.intersect(array_of_shapes, shape4))
// console.log(array_of_shapes)
// console.log(shape)
assert(sb.intersect(array_of_shapes, shape))

assert.deepEqual(block1,block2)
assert.notDeepEqual(block1,block3)


// Development, check full row
var empty = []
var lastRowIncomple = sb.shapeBuilder([ [1],
                              [0],
                              [1,-1,0,1,1],
                              [1,1]])("color")
var lastRowFilled = sb.shapeBuilder([ [1],
                              [1,-1,1,1,1]])("color")

var gausSum = g.gausSum

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

assert(rowSums(lastRowFilled)[1] === gausSum(5))
assert(rowSums(lastRowIncomple)[3] !== gausSum(5))
assert(rowSums(lastRowIncomple)[3] === 3)
assert(rowSums(empty)[0] !== gausSum(5))

//+ lastRowComplete :: (handler :: n -> field-> field)-> field -> field
var lastRowComplete = fn.curry(
  function lastRowComplete(handler, maxColNumber, field) {
    var rowSumsArr = rowSums(field)
    var lastRow = rowSumsArr.length - 1
    if( lastRow > 0 ) {
      if( rowSumsArr[lastRow] == gausSum(maxColNumber) ) {
        return handler(lastRow, field)
      }
    }
    return field
  }
)

assert.deepEqual(lastRowComplete(
  function(n,field){
    return fn.filter(function(block) {
      return block.y !== n
    }, field)
  }, 5, lastRowFilled), [ { x: 0, y: 0, center: false, color: 'color' } ])

assert.deepEqual(lastRowComplete(
  function(n,field){
    return fn.filter(function(block) {
      return block.y !== n
    }, field)
  }, 5, lastRowIncomple), lastRowIncomple)

assert.deepEqual(lastRowComplete(
  function(n,field){
    return fn.filter(function(block) {
      return block.y !== n
    }, field)
  }, 5, empty), empty)

console.log("--------------------------------------------")
