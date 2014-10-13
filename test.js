var fn = require("fn.js")

//+ zip :: (a -> a -> a) -> array -> array ->array
var zip = fn.curry(function(fn,arr1,arr2) {
  var result = []
  if( !arr1 || !arr2) return result

  var len = arr1.length > arr2.length ? arr2.length : arr1.length

  for( var i = 0; i < len; i++) {
    result.push(fn(arr1[i],arr2[i]))
  }
  return result
})

console.log(zip(function(a1,a2) {return a1+a2}, [1,2,3,4,5], [1,2,3,4,5]))


var shape = [ [1,0,0],
              [0,1,0],
              [1,0,1] ]

//+ coordinates :: [[]] -> [[Number,Number]]
var shapeCoordinates = function(arr) {
  var result = []
  for( var r = 0; r < arr.length; r++) {
    for(var c = 0; c < arr[r].length; c++) {
      if( arr[r][c] !== 0 ) {
        result.push([r,c])
      }
    }
  }
  return result
}

console.log(shapeCoordinates(shape))
