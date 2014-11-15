fn = require("./frameworks/fn.js")
g = require("./general.js")
var sb = require("./shapeBuilders.js")
var assert = require('assert')


    var field = (function field(width, height) {
      var w = width
      var h = height
      var arr = []
      var emptyRow = (function(cols, v) {
          res = []
          for( var x = 0; x < cols; x++) {
              res.push(v)
          }
          return res;
      })(width,null)
      
      var filledArray = function(cols, v) {
          res = []
          for( var x = 0; x < cols; x++) {
              res.push(v)
          }
          return res;
      }

      var get = function(x,y) {
        return arr[y*w + x]
      }
      var set = function(x,y,v) {
        if( x >= 0 && x < w && y >= 0 && y < h) {
          arr[y*w + x] = v
        }
        return this
      }
      
      
      this.get = get
      this.set = set

      
      var out = function(outFn) {
          return arr.reduce( function( a, v, i ) {
              return a.concat(outFn(
          }, [])
          for( var y = 0; y < height; y++ ) {
              for( var x = 0; x < width; x++ ) {
                res.push(outFn(x,y,get(x,y)))
              }
          }
      }
      this.out = out
      
      this.log2 = function() {
          
      }
      
      this.log = function() {
          for( var y = 0; y < height; y++ ) {
              row = ""
              for( var x = 0; x < width; x++ ) {
                row = row.concat(get(x,y) ? 'X' : 'O')
              }
              console.log(row)
          }
          console.log(filledArray(width,'-').join(''))
      }
      
      this.fillRow = function(r,v) {
          for( var x = 0; x < width; x++ ) {
              set(x,r,v)
          }
      }
      
      this.fall = function() {
          arr.unshift.apply(arr, emptyRow) 
          arr.splice(height*width)
      }
      
      this.removeRowAndShrink = function(r) {
          arr.splice(r*width, width)
          arr.unshift.apply(arr, emptyRow) 
      }
      
      this.width = width
      this.height = height
      return this
    })(10,20)

    field.fillRow(18,'X')
    field.fillRow(17,'X')
    field.fillRow(16,'X')
    field.set(2,15,'X')
    field.log()
    field.removeRowAndShrink(17)
    field.log()
    field.removeRowAndShrink(17)
    field.log()
    field.removeRowAndShrink(18)
    field.log()
    
console.log("--------------------------------------------")
