var fn = require("fn.js")

//+ inc :: NUmber -> Number
var inc = function(n) {
  return n + 1
}

fn.compose(console.log, inc,inc,inc)(0)
