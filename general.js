//+ id :: a -> a // identity function
function id(a) {return a}

//+ rnd :: Integer -> Integer
function rnd(modul) {
  return Math.floor(((Math.random() * 1000000000) % modul))
}

//+ iff :: fn true -> fn false -> fn -> v -> bool -> fn
var iff = fn.curry( function(ft, ff, b, v) {
  if(b(v) === true) {
      return ft(v)
  } else {
    return ff(v)
  }
})


//+ ifTrue :: fn -> bool
var ifTrue = fn.curry(function(f,b) {
  if(b === true) {return f}
})

//+ add :: Number -> Number -> Number
var add = fn.curry(function(a1,a2) {return a1+a2})

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

//+ Maybe :: v -> Maybe(v)
function Maybe(v) {
  return function() {return v}
}

//+ apply :: fn -> Maybe -> Maybe
var apply = fn.curry(function(f,m) {
  return m() ? Maybe(f(m())) : Maybe(null)
})

//+ val :: Maybe(v) -> v
var val = function(m) { return m() }

//+ either :: a -> b -> ???
var either = fn.curry(function(defaultValue,alternative) {
  return alternative ? alternative : defaultValue;
})


//+ coordinates :: [[]] -> [[Number,Number]]
var shapeCoordinates = function(arr) {
  var result = []
  for( var r = 0; r < arr.length; r++) {
    var cols = arr[r]
    for(var c = 0; c < arr[r].length; c++) {
      if( cols[c] !== 0 ) {
        result.push([c,r])
      }
    }
  }
  return result
}

// + inRect :: number -> number -> number -> number -> number -> bool
var inRect = fn.curry(function(left, top, width, height, x, y){
  return x <= left + width && left <= x && y >= top && y <= top + height
})

//+ not :: bool -> bool
function not(b) { return !b}

//+ dot :: game -> a // projection function
var dot = fn.curry(function(coordinate, tupple) {
  return tupple[coordinate]
})

//+ copyValidProperty :: pName -> pName -> tup -> tup
var copyValidProperty = fn.curry( function(toPropName,fromPropName,tup) {
  if(tup[fromPropName]) tup[toPropName] = tup[fromPropName]
  return tup
})

//+ assignValidProperty :: pname -> a -> tup -> tup
var assignValidProperty = fn.curry(function(pname, value, tup) {
    if(value && pname && tup ) {tup[pname] = value}
    return tup
})

//+ run : [fn] -> a -> b
var run = fn.curry( function run(q, a) {
  var accu  = a
  while(q.length > 0) {
    var f = q.shift()
    accu = f(accu)
  }
  return accu
})


//+ trace :: b -> a -> a
var trace = fn.curry(function trace(b,a) {
  console.log("TRACE",b,":", a)
  return a
})
