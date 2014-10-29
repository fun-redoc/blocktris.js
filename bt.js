fn = require("./fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')


var vector = {
  equal: fn.curry(function(v1,v2) {
    return v1['x'] === v2['x'] && v1['y'] === v2['y']
  }),
  contains: fn.curry(function(vs, v) {
    return vs.some(vector.equal(v))
  }),
  intersect: function (vs1, vs2) {
    var a1 = [].concat(vs1)
    var a2 = [].concat(vs2)
    return a1.some(vector.contains(a2))
  },
}


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

assert(vector.equal(block1,block2))
assert.notEqual(vector.equal(block1,block3))

assert(vector.contains(shape, block2))
assert.notEqual(vector.contains(shape, block4))

assert(vector.intersect(shape, shape2))
assert(vector.intersect(shape2, shape))
assert(vector.intersect(shape, block2))
assert(vector.intersect(shape, block1))
assert.notEqual(vector.intersect(shape3, shape2))
assert.notEqual(vector.intersect(shape3, shape))

assert.notEqual(vector.intersect(array_of_shapes, shape4))
assert(vector.intersect(array_of_shapes, shape))

assert.deepEqual(block1,block2)
assert.notDeepEqual(block1,block3)


console.log("--------------------------------------------")
