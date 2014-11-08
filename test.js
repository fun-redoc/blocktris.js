
var fn = require("frameworks/fn.js")


var makeBlocks = fn.memoize(function(a) {
  return a.reduce( function(accuRow, row, idxRow) {
    return accuRow.concat(row.reduce( function(accu, col, idxCol) {
            return col !== 0 ? accu.concat({x:idxCol, y:idxRow}) : accu;
          },[]))
  }, [])
})

function shapeBuilderT() {
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
    return { "0" : makeBlocks(r0),
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}

console.log(shapeBuilderT()["0"])
