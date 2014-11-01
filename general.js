(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.g = factory();
  }
}(this, function(require, exports, module) {
'use strict';


var g = { };



//+ id :: a -> a // identity function
g.id = function id(a) {return a}

//+ rnd :: Integer -> Integer
g.rnd = function rnd(modul) {
  return Math.floor(((Math.random() * 1000000000) % modul))
}

//+ iff :: fn true -> fn false -> fn -> v -> bool -> fn
g.iff = fn.curry( function(ft, ff, b, v) {
  if(b(v) === true) {
      return ft(v)
  } else {
    return ff(v)
  }
})


//+ ifTrue :: fn -> bool
g.ifTrue = fn.curry(function(f,b) {
  if(b === true) {return f}
})

//+ add :: Number -> Number -> Number
g.add = fn.curry(function(a1,a2) {return a1+a2})

//+ zip :: (a -> a -> a) -> array -> array ->array
g.zip = fn.curry(function(fn,arr1,arr2) {
  var result = []
  if( !arr1 || !arr2) return result

  var len = arr1.length > arr2.length ? arr2.length : arr1.length

  for( var i = 0; i < len; i++) {
    result.push(fn(arr1[i],arr2[i]))
  }
  return result
})

//+ Maybe :: v -> Maybe(v)
g.Maybe = function maybe(v) {
  return function() {return v}
}

//+ apply :: fn -> Maybe -> Maybe
g.apply = fn.curry(function(f,m) {
  return m() ? maybe(f(m())) : maybe(null)
})

//+ val :: Maybe(v) -> v
g.val = function(m) { return m() }

//+ either :: a -> b -> ???
g.either = fn.curry(function(defaultValue,alternative) {
  return alternative ? alternative : defaultValue;
})

// + inRect :: number -> number -> number -> number -> number -> bool
g.inRect = fn.curry(function(left, top, width, height, x, y){
  return x < left + width && left <= x && y >= top && y < top + height
})

//+ not :: bool -> bool
g.not = function not(b) { return !b}

//+ dot :: game -> a // projection function
g.dot = fn.curry(function(coordinate, tupple) {
  return tupple[coordinate]
})

//+ copyValidProperty :: pName -> pName -> tup -> tup
g.copyValidProperty = fn.curry( function(toPropName,fromPropName,tup) {
  if(tup[fromPropName]) tup[toPropName] = tup[fromPropName]
  return tup
})

//+ assignValidProperty :: pname -> a -> tup -> tup
g.assignValidProperty = fn.curry(function(pname, value, tup) {
    if(value && pname && tup ) {tup[pname] = value}
    return tup
})

//+ run : [fn] -> a -> b
g.run = fn.curry( function run(q, a) {
  var accu  = a
  while(q.length > 0) {
    var f = q.shift()
    accu = f(accu)
  }
  return accu
})

//+ set :: k -> v -> o -> o
g.set = fn.curry(function(key, value, object) {
  object[key] = value
  return object
})

//+ get ::
g.get = fn.prop

//+ map :: (a -> b) -> [a] -> [b]
g.map = fn.curry(function(handler,collection) {
  return fn.map(handler,collection)
})


//+ trace :: b -> a -> a
g.trace = fn.curry(function trace(b,a) {
  console.log("TRACE",b,":", a)
  return a
})

g.move = fn.curry(function(x, y, vector) {
  vector.x += x
  vector.y += y
  return vector
  // return fn.compose(set('x',vector.x + x),
  //                    set('y', vector.y + y),
  //                    copy)(vector)
})

//+ copy :: a -> a
g.copy = function copy(origin) {
  if( origin instanceof Array) return fn.map(copy,origin)

  if( typeof origin === 'object') {
    return Object.keys(origin).reduce( function(accu, key) {
      accu[key] = typeof origin[key] === 'object' ? copy(origin[key]) : origin[key]
      return accu
    }, {})
  }

  return origin
}

  //+ equal2D :: {x,y} -> {x,y} -> boolean
  g.equal2D = fn.curry(function(v1,v2) {
    return v1.x === v2.x && v1.y === v2.y
  })

  //+ flatten :: [[a]] ->[a]
  g.flatten = function flatten(arr) {
    if(!(arr instanceof Array)) return [arr]
    return fn.reduce( function(accu, val) {
      var isINstanceOfArray = val instanceof Array
      return fn.concat(accu, isINstanceOfArray ? flatten(val) : val)
    },[], arr)
  }

  //+ contains :: (p :: a -> boolean) -> [a] -> a -> boolean
  g.contains = fn.curry(function(p, vs, v) {
    return vs.some(p(v))
  })

  //+ intersect :: ((p :: a -> boolean), [a],[a]) -> boolean
  g.intersect = fn.curry(function (p, arr1, arr2) {
    return g.flatten(arr1).some(g.contains(p,g.flatten(arr2)))
  })


// RETURN public object
return g;
}));
