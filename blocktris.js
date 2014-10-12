$(document).ready( function() {
    var sprites
    gameController( new playGame([], $("div#panel")) )
})

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
        .offset({ top: row*BlockSize + GameFieldPosY, left: col*BlockSize + GameFieldPosX}).html(mark)
    return $block
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

    //+ updateSpriteFromShape :: $div -> shape ->
    function updateSpriteFromShape(sprite)

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
        updateSpriteFromShape(this)
        return this
    }

    sprite.prototype.rotateClockwise = function() {
        this.shape = this.shape.rotateClockwise()
        spriteFromShape(this)
        return this
    }

    sprite.prototype.rotateCounterClockwise = function() {
        this.shape = this.shape.rotateCounterClockwise()
        spriteFromShape(this)
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
        //console.log("-->", resultArray)
        return resultArray
    }


    drawShapeAt(this.$div,this.shape,this.shape.color)

    return this
}

function gameController(game) {
  $(document).keydown(function( event ) {
      // console.log(event.which)
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

function playGame(sprites, $panel) {
    this.$panel = $panel
    this.stopped = false
    this.sh = new shape(shapeBuilderI,"orange")
    this.sp = new sprite(this.sh,this.$panel)
    this.$panel.append(this.sp.$div)
    this.hello = "hello"


    function randomShape() {
        console.log("NOT YET IMPLEMENTED")
    }

    function touchesBottom(blocks) {
        console.log("NOT YET IMPLEMENTED")
        return true
    }

    function readyFieldsAdd(shape) {
        console.log("NOT YET IMPLEMENTED")
    }
}

playGame.prototype.tick = function() {
  console.log("tick", this.hello)
  if( this.stopped === true ) return

  var bottomBlocks = this.sp.fall().bottomBlocks()
  // console.log(bottomBlocks)
      /*if( touchesBottom(bottomBlocks) ) {
          readyFieldsAdd(sp)
          sp = randomShape()
      } else if (touchesReady(bottomBlocks)) {
          readyFieldAdd(sp)
          sp = randomShape()
      }*/
}
playGame.prototype.stop = function() {
  console.log("stop", this.hello)
  this.stopped = true
}
playGame.prototype.continue = function() {
  console.log("continue", this.hello)
  this.stopped = false
}
playGame.prototype.restart = function() {
  console.log("restart", this.hello)
  this.sp.startPosition()
  this.continue()
}
playGame.prototype.left = function() {
  console.log("left", this.hello)
  this.sp.left()
}
playGame.prototype.right = function() {
  console.log("right", this.hello)
  this.sp.right()
}
playGame.prototype.rotateCounterClockwise = function() {
  console.log("rotateCounterClockwise", this.hello)
  this.sp.rotateCounterClockwise()
}
playGame.prototype.rotateClockwise = function() {
  console.log("rotateClockwise", this.hello)
  this.sp.rotateClockwise()
}
