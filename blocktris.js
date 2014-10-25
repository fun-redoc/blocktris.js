// var fn = require("./fn.js")
// var sb = require("./sb.s.js")


$(document).ready( function() {
    gameController( [
                      sb.I("orange","0"),
                      sb.T("red","0"),
                      sb.S("green","0"),
                      sb.Z("blue","0"),
                      sb.L("magenta","0"),
                      sb.J("brown","0")
                    ],
                    { fallenShapes : [],
                      stop: false,
                    },
                    $("div#panel"))
})

var GameFieldPosX = 20
var GameFieldPosY = 20

var BlockSize = 20
var GameFieldRows = 20
var GameFieldCols = 10


var move = fn.curry(function(x, y, vector) {
  return {x:vector.x + x, y:vector.y + y}
})

var fall = function fall(vector) {
  return {x:vector.x, y:vector.y+1}
}

var moveL = function moveL(vector) {
  return {x:vector.x-1, y:vector.y}
}

var moveR = function moveR(vector) {
  return {x:vector.x+1, y:vector.y}
}

var rotR = function(vector) {
  return {x:-vector.y, y:vector.x}
}

var rotL = function(vector) {
  return {x:vector.y, y:-vector.x}
}

// +positionBlock :: $div -> x -> y -> $div
var positionBlock = fn.curry(function($div,x,y) {
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
})

// + inGameField :: number -> number -> bool
var inGameField = inRect(GameFieldPosX, GameFieldPosY, GameFieldCols, GameFieldRows)


//+ notInGameField :: number -> number -> bool
var notInGameField = fn.compose(not, inGameField)


function blockAt(col, row, color,mark) {
    var $block =  $("<div/>")
        .addClass("block")
        .css({backgroundColor: color})
        .width(BlockSize)
        .height(BlockSize)
        .offset({ top: row*BlockSize + GameFieldPosY, left: col*BlockSize + GameFieldPosX})
        .html(mark)
    return $block
}

function blockMoveBy($div, x,y) {
  $div.offset({ top: $div.offset().top + y*BlockSize, left: $div.offset().left + x*BlockSize})
  return $div
}

//+ collision :: game -> bool
var collision = function(game) {
  // TODO
  return false
}

//+ randomShape :: [sb.] -> ???
function randomShape(sbs) {
    var mod = sbs.length
    //not yet clear
    return function() {return sbs[rnd(mod)]}
}

//+ tick :: (fn :: [shapes] -> shape) -> shape -> (fn :: game -> game)
var tick = fn.curry(function(nextShapeMaker, currentShape) {

  var fallenShape = fn.map(fall, currentShape.blocks)

  // TODO pass notInGameField as parameter
  var canFall = fn.filter(fn.compose(trace("not in game field"),notInGameField), fallenShape).length === 0
canFall = true
  return canFall ?  function(g) {
      g.currentShape.blocks = fallenShape; return g
      } :
                     function(g) { g.currentShape = nextShapeMaker(); return g }
  // TODO collision with other shapes
})


function render($panel, game) {
    function drawShapeAt(panel, shape) {
        fn.each( function(pair) {
            panel.append( blockAt(pair.x, pair.y,shape.color, '.'))
        },shape.blocks)
    }

    function updateSpriteByShape(sprite, shape) {
      sprite.children().each(function(idx) {
        positionBlock($(this), shape.blocks[idx].x,shape.blocks[idx].y)
      })
      return sprite
    }

    if($panel.children().size() <= 0) {
      // TODO
      //.... drawAt rendertn nich innerhalb vom div sondern parallel!
      drawShapeAt($panel, game.currentShape, game.currentShape.color)
    } else {
      updateSpriteByShape($panel, game.currentShape)
    }
}

function gameController(shapes, game, viewPanel) {
  var update = []
  var nextShapeMaker = randomShape(shapes)
  game.currentShape = nextShapeMaker()
  var nextTick = tick(nextShapeMaker)
  setInterval(function() { update.push(nextTick(game.currentShape)) }, 1000)
  setInterval(function() { render(viewPanel, run(update,game))  }, 100)

  $(document).keydown(function( event ) {
      //console.log(event.which)
      if ( event.which == 82 /*r = restart*/ ) {
          update.push(function(game) {
            game.currentShape.startPosition()
            return game
          })
          event.preventDefault()
      }
      if ( event.which == 83 /*s = stop*/ ) {
          update.push(function(game) {
            console.log("GAME STOP")
            game.stop = true
            return game
          })

          event.preventDefault()
      }
      if ( event.which == 67 /*c = continue*/ ) {
          update.push(function(game) {
            console.log("CONTINUE")
            game.stop = false
            return game
          })
          // game.continue()
          event.preventDefault()
      }
      if ( event.which == 37 /*left*/ ) {
          update.push(function(game) {
            // TODO left boud!!
            console.log("LEFT")
            game.currentShape.blocks = fn.map(moveL,game.currentShape.blocks)
            return game
          })
          // game.left()
          event.preventDefault()
      }
      if ( event.which == 39 /*right*/ ) {
          update.push(function(game) {
            // TODO rigth boud!!
            console.log("RIGHT")
            game.currentShape.blocks = fn.map(moveR,game.currentShape.blocks)
            return game
          })
          // game.right()
          event.preventDefault()
      }
      if ( event.which == 89 /*y*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape.blocks = fn.map(rotR,game.currentShape.blocks)
            return game
          })
          event.preventDefault()
      }
      if ( event.which == 88 /*x*/ ) {
          update.push(function(game) {
            // TODO bounds!!
            game.currentShape.blocks = fn.map(rotL,game.currentShape.blocks)
            return game
          })
          event.preventDefault()
      }
  })
}
