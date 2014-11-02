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


  var makeBlocks = function(a,color) {
    return a.reduce( function(accuRow, row, idxRow) {
      return accuRow.concat(row.reduce( function(accu, col, idxCol) {
              return col !== 0 ? accu.concat({x:idxCol, y:idxRow, center: (col === -1), color: color}) : accu;
            },[]))
    }, [])
  }

  //+ shapeBuilder :: [] -> color -> [blocks]
  var shapeBuilder = fn.curry(function(shapeDesign,color) {
    var blocks = makeBlocks(shapeDesign, color)
    return blocks
  })

  //+ centerBlock :: shape -> block
  var centerBlock = function(shape) {
    return fn.filter(function(b) {
		return b.center
	}, shape)[0]
  }

  var moveShape = fn.curry(function(moveFn, shape) {
    return fn.map(moveFn,g.copy(shape))
  })

  var neg = function(vector) {
    vector.x *= -1
    vector.y *= -1
    return vector
  }

  var moveTo = fn.curry(function(toVector,vector) {
    vector.x += toVector.x
    vector.y += toVector.y
    return vector
  })

  var rot = fn.curry(function(rotFn, center, vector) {
    return fn.compose(
                      //  g.trace("->"),
                       moveTo(center),
                      //  g.trace("R"),
                       rotFn,
                      //  g.trace("B"),
                       moveTo(neg(g.copy(center))),
                      //  g.trace('O'),
                       g.id
                  )(vector)
  })

  var rotR = rot(function(v){return fn.compose(g.set('x',-v.y), g.set('y',v.x))(v)})

  var rotL = rot(function(v){return fn.compose(g.set('x',v.y), g.set('y',-v.x))(v)})

  //+ rotShape :: (vector -> [vector] -> [vector]) -> shape -> shape
  var rotShape = fn.curry(function(rotFn, shape) {
    var center = g.copy(centerBlock(shape))
    var blocks = fn.map(rotFn(center),g.copy(shape))
    return blocks
  })


  // public API
  sb.shapeBuilder = shapeBuilder

  //+ T :: color -> {color,blocks,center}
  sb.T = shapeBuilder([
                   [1,-1,1],
                   [0,1,0]])

  //+ S :: color -> {color,blocks,center}
  sb. S = shapeBuilder([
                       [0,-1,1],
                       [1,1,0]])

  //+ Z :: color -> {color,blocks,center}
  sb. Z = shapeBuilder([
                       [1,-1,0],
                       [0,1,1]])

  //+ L :: color -> {color,blocks,center}
  sb. L = shapeBuilder([
                       [1,0],
                       [-1,0],
                       [1,1]])

  //+ J :: color -> {color,blocks,center}
  sb. J = shapeBuilder([
                       [0,1],
                       [0,-1],
                       [1,1]])

  //+ I :: color -> {color,blocks,center}
  sb. I = shapeBuilder([
                   [0,1],
                   [0,-1],
                   [0,1],
                   [0,1]])

  sb.fall = moveShape(g.move(0,1))

  sb.moveL = moveShape(g.move(-1,0))

  sb.moveR = moveShape(g.move(1,0))

  sb.rotLShape = rotShape(rotL)

  sb.rotRShape = rotShape(rotR)

  //+ intersect :: [a] -> [a] -> boolean
  sb.intersect = g.intersect(g.equal2D)

  return sb;
}));
