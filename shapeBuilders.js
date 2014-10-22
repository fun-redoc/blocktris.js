var makeBlocks = fn.memoize(function(a) {
  return a.reduce( function(accuRow, row, idxRow) {
    return accuRow.concat(row.reduce( function(accu, col, idxCol) {
            return col !== 0 ? accu.concat({x:idxCol, y:idxRow}) : accu;
          },[]))
  }, [])
})

var shapeBuilderT = fn.curry(function shapeBuilderT(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r180),
            "270" : makeBlocks(this.r270)
    }
    return {color:color, blocks:rotations[angle]}
})


var shapeBuilderS = fn.curry(function shapeBuilderS(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r180),
            "270" : makeBlocks(this.r270)
    }
    return {color:color, blocks:rotations[angle]}
})

var shapeBuilderZ = fn.curry(function shapeBuilderZ(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r180),
            "270" : makeBlocks(this.r270)
    }
    return {color:color, blocks:rotations[angle]}
})

var shapeBuilderL = fn.curry(function shapeBuilderL(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r180),
            "270" : makeBlocks(this.r270)
    }
    return {color:color, blocks:rotations[angle]}
})

var shapeBuilderJ = fn.curry(function shapeBuilderJ(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r180),
            "270" : makeBlocks(this.r270)
    }
    return {color:color, blocks:rotations[angle]}
})

var shapeBuilderI = fn.curry(function shapeBuilderI(color,angle) {
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
            "0" : makeBlocks(this.r0),
            "90" : makeBlocks(this.r90),
            "180" : makeBlocks(this.r0),
            "270" : makeBlocks(this.r90)
    }
    return {color:color, blocks:rotations[angle]}
})
