var fn = require("fn.js")



//+ iff :: fn -> bool -> fn
var iff = fn.curry( function(ft, ff, b) {
  if(b === true) {return ft}
    else {return ff}
})

var a = iff(function() {console.log("hallo true")},function() {console.log("hallo false")})(true)
var b = iff(function() {console.log("hallo true")},function() {console.log("hallo false")})(false)

a()
b()

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

var inc = function(v) { return v + 1 }

fn.compose(console.log,val,apply(inc), apply(inc), Maybe)(undefined)

// fn.compose(console.log, apply(inc), appl(inc)




console.log(inGameField( 4, 19 ))
