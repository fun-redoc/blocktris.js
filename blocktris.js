$(document).ready( function() {
    var sprites
    gameController( new playGame([
                                    new shape(shapeBuilderI,"orange"),
                                    new shape(shapeBuilderT,"orange"),
                                    new shape(shapeBuilderS,"orange"),
                                    new shape(shapeBuilderZ,"orange"),
                                    new shape(shapeBuilderL,"orange"),
                                    new shape(shapeBuilderJ,"orange")
                                    ],
                                    $("div#panel")) )
})

//+ rnd :: Integer -> Integer
function rnd(modul) {
  return Math.floor(((Math.random() * 1000000000) % modul))
}

//+ iff :: fn -> bool -> fn
var iff = fn.curry( function(ft, ff, b) {
  if(b === true) {return ft}
    else {return ff}
})

//+ ifTrue :: fn -> bool
var ifTrue = fn.curry(function(f,b) {
  if(b === true) {return f}
})

//+ add :: Number -> Number -> Number
var add = fn.curry(function(a1,a2) {return a1+a2})

//+ zip :: (a -> a -> a) -> array -> array ->array
var zip = fn.curry(function(fn,arr1,arr2) {
  var result = []
  if( !arr1 || !arr2) return result

  var len = arr1.length > arr2.length ? arr2.length : arr1.length

  for( var i = 0; i < len; i++) {
    result.push(fn(arr1[i],arr2[i]))
  }
  return result
})

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


//+ coordinates :: [[]] -> [[Number,Number]]
var shapeCoordinates = function(arr) {
  var result = []
  for( var r = 0; r < arr.length; r++) {
    var cols = arr[r]
    for(var c = 0; c < arr[r].length; c++) {
      if( cols[c] !== 0 ) {
        result.push([c,r])
      }
    }
  }
  return result
}

// +positionBlock :: $div -> x -> y -> $div
var positionBlock = fn.curry(function($div,x,y) {
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
})

// + inRect :: number -> number -> number -> number -> number -> bool
var inRect = fn.curry(function(left, top, width, height, x, y){
  return x <= left + width && left <= x && y >= top && y <= top + height
})

// + inGameField :: number -> number -> bool
var inGameField = inRect(GameFieldPosX, GameFieldPosY, GameFieldCols, GameFieldRows)

//+ not :: bool -> bool
function not(b) { return !b}

//+ blockTouchesGround :: number -> number -> bool
var blockTouchesGround = fn.compose(not, inGameField)


//+ trace :: a -> a
function trace(a) {
  console.log(a)
  return a
}

var GameFieldPosX = 20
var GameFieldPosY = 20


var BlockSize = 20
var GameFieldRows = 20
var GameFieldCols = 10

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
    return { "0" : r0,
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}


function shapeBuilderS() {
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
    return { "0" : r0,
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}

function shapeBuilderZ() {
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
    return { "0" : r0,
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}

function shapeBuilderL() {
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
    return { "0" : r0,
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}

function shapeBuilderJ() {
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
    return { "0" : r0,
            "90" : r90,
            "180" : r180,
            "270" : r270
    }
}
function shapeBuilderI() {
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
    return { "0" : r0,
            "90" : r90,
            "180" : r0,
            "270" : r90
    }
}

function shape(shapeBuilder,color,x,y,rot) {
    shape.prototype.position = function(x,y) {
        return new shape(this.shapeBuilder, this.color,  x, y, this.rot)
    }
    shape.prototype.move = function(x,y) {
        return new shape(this.shapeBuilder, this.color, this.pos.x + x, this.pos.y + y, this.rot)
    }
    shape.prototype.rotateClockwise = function() {
        switch (this.rot) {
            case '0': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "90"); break;
            case '90': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "180"); break;
            case '180': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "270"); break;
            case '270': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "0");break;
            default:
                return this
        }
    }
    shape.prototype.rotateCounterClockwise = function() {
        switch (this.rot) {
            case '0': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "270"); break;
            case '90': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "0"); break;
            case '180': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "90");break;
            case '270': return new shape(this.shapeBuilder, this.color, this.pos.x, this.pos.y, "180" ); break;
            default:
                return this
        }
    }
    this.shapeBuilder = shapeBuilder
    this.pos = {"x":x || 0, "y":y||0 }
    this.rot = rot || '0'
    this.color = color ||'grey'
    return this
}

function sprite(shape, $panel) {
    this.shape = shape
    this.$div = $("<div/>")
    this.$panel = $panel

     function emptySprite(sprite) {
       sprite.$div.remove()
       sprite.$div = $("<div/>")
       return sprite
    }

    function spriteFromShape(sprite, shape) {
        emptySprite(sprite)
        drawShapeAt(sprite.$div,sprite.shape,sprite.shape.color)
        sprite.$panel.append( sprite.$div )
        return sprite
    }

    function drawShapeAt(panel, shape, color) {
        shape.shapeBuilder()[shape.rot].forEach( function(row, idxY, arr) {
            row.forEach( function(col,idxX,arr) {
                if( col !== 0 ) {
                    panel.append( blockAt(idxX + shape.pos.x, idxY + shape.pos.y,color, '.'))
                }
            })
        })
    }

    //+ updateSpriteFromShape :: $div -> Number -> Number -> $div
    function updateSpriteApperance($div, x, y) {
      $div.children().each( function(idx) {
          blockMoveBy($(this),x,y) })
      return $div
    }

    function updateSpriteByShape(sprite, shape) {
      var shapeCoords = shapeCoordinates(shape.shapeBuilder()[shape.rot])
      var shapeCoordinatesWithOffset = fn.map(zip(add,[shape.pos.x, shape.pos.y]) ,shapeCoords)
      sprite.$div.children().each(function(idx) {
        fn.apply(positionBlock($(this)), shapeCoordinatesWithOffset[idx])
      })
      return sprite
    }

    function move(x, y, sprite) {
      return fn.compose(spriteFromShape, function moveSpritesShape(s) {s.shape = s.shape.move(x,y); return s})(sprite)
    }

    sprite.prototype.fall = function() {
        return this.move(0,1)

    }

    sprite.prototype.left = function() {
        return this.move(-1,0)
    }

    sprite.prototype.right = function() {
        return this.move(1,0)
    }

    sprite.prototype.move = function(x,y) {
        // return move(x,y, this)
        this.shape = this.shape.move(x,y)
        // updateSpriteApperance(this.$div, x, y)
        updateSpriteByShape(this, this.shape)
        return this
    }

    sprite.prototype.rotateClockwise = function() {
        this.shape = this.shape.rotateClockwise()
        // spriteFromShape(this)
        updateSpriteByShape(this, this.shape)
        return this
    }

    sprite.prototype.rotateCounterClockwise = function() {
        this.shape = this.shape.rotateCounterClockwise()
        // spriteFromShape(this)
        updateSpriteByShape(this, this.shape)
        return this
    }

    sprite.prototype.startPosition = function() {
      this.shape = this.shape.position(0,0)
      return this
    }

    sprite.prototype.bottomBlocks = function() {
        var blockArray = shape.shapeBuilder()[shape.rot]
        var bottomBlockArray = blockArray.pop()
        var lastRow = blockArray.length - 1
        var shapePos = this.shape.pos
        var resultArray = bottomBlockArray.reduce( function(previousValue, currentValue, index, array) {
            if( currentValue != 0) {
                return  previousValue.concat({"x":shapePos.x + index, "y": lastRow + shapePos.y})
            } else {
                return previousValue
            }
        }, [])
        ////console.log("-->", resultArray)
        return resultArray
    }


    drawShapeAt(this.$div,this.shape,this.shape.color)

    return this
}

function gameController(game) {
  $(document).keydown(function( event ) {
      // //console.log(event.which)
      if ( event.which == 82 /*r = restart*/ ) {
          stop = false
          game.restart()
          event.preventDefault()
      }
      if ( event.which == 83 /*s = stop*/ ) {
          game.stop()
          event.preventDefault()
      }
      if ( event.which == 67 /*c = continue*/ ) {
          game.continue()
          event.preventDefault()
      }
      if ( event.which == 37 /*left*/ ) {
          game.left()
          event.preventDefault()
      }
      if ( event.which == 39 /*right*/ ) {
          game.right()
          event.preventDefault()
      }
      if ( event.which == 89 /*y*/ ) {
          game.rotateCounterClockwise()
          event.preventDefault()
      }
      if ( event.which == 88 /*x*/ ) {
          game.rotateClockwise()
          event.preventDefault()
      }
  })
  setInterval(function() { game.tick() }, 1000)
}

function playGame(shapes, $panel) {
    this.$panel = $panel
    this.nextShape = randomShape(shapes)
    this.stopped = false
    this.sh = this.nextShape() //new shape(shapeBuilderI,"orange")
    this.sp = new sprite(this.sh,this.$panel)
    this.$panel.append(this.sp.$div)
    this.hello = "hello"


    function randomShape(shapes) {
        //console.log("NOT YET IMPLEMENTED")
        var mod = shapes.length
        return function() { return shapes[rnd(mod)] }
    }

    function touchesBottom(blocks) {
        //console.log("NOT YET IMPLEMENTED")
        return true
    }

    function readyFieldsAdd(shape) {
        //console.log("NOT YET IMPLEMENTED")
    }
}

playGame.prototype.tick = function() {
  //console.log("tick", this.hello)

  if( this.stopped === true ) return

  var bottomBlocks = this.sp.fall().bottomBlocks()
  // PROBLEM: fall shoub be called after it is shure that the block doesnt toouch the ground
  //          so i will have to move shape first, than check if there is a collision than draw the sprite
  //        => refactor the movement functions, separate the concerns of moveing and drawing
  fn.compose(iff(this.nextShape, this.sp.fall), trace, touchesGround, trace)(this.sp.bottomBlocks)()
  //console.log(bottomBlocks)
      /*if( touchesBottom(bottomBlocks) ) {
          readyFieldsAdd(sp)
          sp = randomShape()
      } else if (touchesReady(bottomBlocks)) {
          readyFieldAdd(sp)
          sp = randomShape()
      }*/
}
playGame.prototype.stop = function() {
  //console.log("stop", this.hello)
  this.stopped = true
}
playGame.prototype.continue = function() {
  //console.log("continue", this.hello)
  this.stopped = false
}
playGame.prototype.restart = function() {
  //console.log("restart", this.hello)
  this.sp.startPosition()
  this.continue()
}
playGame.prototype.left = function() {
  //console.log("left", this.hello)
  this.sp.left()
}
playGame.prototype.right = function() {
  //console.log("right", this.hello)
  this.sp.right()
}
playGame.prototype.rotateCounterClockwise = function() {
  //console.log("rotateCounterClockwise", this.hello)
  this.sp.rotateCounterClockwise()
}
playGame.prototype.rotateClockwise = function() {
  //console.log("rotateClockwise", this.hello)
  this.sp.rotateClockwise()
}
