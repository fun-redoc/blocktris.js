
var fn = require("fn.js")
//
// var queue = []
//
// queue.push( function add1(a) {return a +1} )
// queue.push(function add2(a) {return a +2} )
// queue.push(function check3(a) {return a === 3} )
//
// console.log(queue)
//
//
// //+ compose : [fn] -> a -> b
// var compose = fn.curry( function compose(q, a) {
//   var accu  = a
//   while(q.length > 0) {
//     var f = q.shift()
//     accu = f(accu)
//   }
//   return accu
// })
//
// console.log(queue, compose(queue)(0))
//
// console.log([], compose([])(0))


//+ iff :: fn true -> fn false -> fn -> v -> bool -> fn
var iff = fn.curry( function(ft, ff, b, v) {
  if(b(v) === true) {
      return ft(v)
  } else {
    return ff(v)
  }
})

iff(function(v) {console.log("true",v)},
               function(v) {console.log("false",v)},
               function(v) {console.log("test",v); return v === 0})(0)
