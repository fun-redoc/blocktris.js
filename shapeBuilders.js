(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.sb = factory();
  }
}(this, function(require, exports, module) {
'use strict';


var sb = { };


  var makeBlocks = fn.memoize(function(a) {
    return a.reduce( function(accuRow, row, idxRow) {
      return accuRow.concat(row.reduce( function(accu, col, idxCol) {
              return col !== 0 ? accu.concat({x:idxCol, y:idxRow}) : accu;
            },[]))
    }, [])
  })

  sb.T = fn.curry(function shapeBuilderT(color,angle) {
      var r0 =  [
                       [1,1,1],
                       [0,1,0]
                     ]
      var r90 = [
                      [0,1],
                      [1,1],
                      [0,1]
                      ]
      var r180 = [
                      [0,1,0],
                      [1,1,1]
                  ]
      var r270 = [
                      [0,1,0],
                      [1,1,1],
                  ]
      var color = color
      var rotations = {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r180),
              "270" : makeBlocks(r270)
      }
      return {color:color, blocks:rotations[angle]}
  })


  sb. S = fn.curry(function shapeBuilderS(color,angle) {
      var r0 =  [
                       [0,1,1],
                       [1,1,0]
                     ]
      var r90 = [
                      [1,0],
                      [1,1],
                      [0,1]
                      ]
      var r180 = [
                      [0,1,1],
                      [1,1,0]
                  ]
      var r270 = [
                      [1,0],
                      [1,1],
                      [0,1]
                  ]
      var color = color
      var rotations =  {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r180),
              "270" : makeBlocks(r270)
      }
      return {color:color, blocks:rotations[angle]}
  })

  sb. Z = fn.curry(function shapeBuilderZ(color,angle) {
      var r0 =  [
                       [1,1,0],
                       [0,1,1]
                     ]
      var r90 = [
                   [0,1],
                   [1,1],
                   [1,0]
                      ]
      var r180 = [
                      [1,1,0],
                      [0,1,1]
                  ]
      var r270 = [
                      [0,1],
                      [1,1],
                      [1,0]
                  ]
      var color = color
      var rotations =  {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r180),
              "270" : makeBlocks(r270)
      }
      return {color:color, blocks:rotations[angle]}
  })

  sb. L = fn.curry(function shapeBuilderL(color,angle) {
      var r0 =  [
                       [1,0],
                       [1,0],
                       [1,1]
                     ]
      var r90 = [
                       [1,1,1],
                       [1,0,0]
                      ]
      var r180 = [
                       [1,1],
                       [0,1],
                       [0,1]
                  ]
      var r270 = [
                       [0,0,1],
                       [1,1,1]
                  ]
      var color = color
      var rotations =  {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r180),
              "270" : makeBlocks(r270)
      }
      return {color:color, blocks:rotations[angle]}
  })

  sb. J = fn.curry(function shapeBuilderJ(color,angle) {
      var r0 =  [
                       [0,1],
                       [0,1],
                       [1,1]
                     ]
      var r90 = [
                       [1,0,0],
                       [1,1,1]
                      ]
      var r180 = [
                       [1,1],
                       [1,0],
                       [1,0]
                  ]
      var r270 = [
                       [1,1,1],
                       [0,0,1]
                  ]
      var color = color
      var rotations =  {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r180),
              "270" : makeBlocks(r270)
      }
      return {color:color, blocks:rotations[angle]}
  })

  sb. I = fn.curry(function shapeBuilderI(color,angle) {
      var r0 =  [
                   [0,1],
                   [0,1],
                   [0,1],
                   [0,1]
                 ]
      var r90 = [
                   [0,0,0,0],
                   [0,0,0,0],
                   [1,1,1,1]
                  ]
      var color = color
      var rotations =  {
              "0" : makeBlocks(r0),
              "90" : makeBlocks(r90),
              "180" : makeBlocks(r0),
              "270" : makeBlocks(r90)
      }
      return {color:color, blocks:rotations[angle]}
  })

  return sb;
}));
