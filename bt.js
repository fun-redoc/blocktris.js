fn = require("./frameworks/fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')


function Test2() {
    var varName = "test2"
    var appendIt = function (n) {
        varName += n
    }

    Test2.prototype.alter = function(n) {
        appendIt(n)
        return this
    }

    Test2.prototype.out = function () {
        console.log(varName)
        return this
    }

    return this
}

new Test2().alter("hello").out()

console.log("--------------------------------------------")
