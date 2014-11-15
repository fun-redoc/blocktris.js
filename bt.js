fn = require("./frameworks/fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')

var add = fn.curry(function(a,b) { return (a?a:0) + (b?b:0)})

var map2 = function map2(fn, a1,a2) {
    var v1, v2
    if( a1.length > a2.length) {
        v1 = a1
        v2 = a2
    } else {
        v1 = a2
        v2 = a1
    }
    return v1.map( function (o,i) {
        var res = fn(o, v2[i])
        return res
    })
}

assert.deepEqual( map2(add, [],[]), [])
assert.deepEqual( map2(add, [1],[]), [1])
assert.deepEqual( map2(add, [],[2]), [2])
assert.deepEqual( map2(add, [1,2],[2]), [3,2])
assert.deepEqual( map2(add, [1],[2,3]), [3,3])
assert.deepEqual( map2(add, [1,2],[3,4]), [4,6])

console.log("--------------------------------------------")
