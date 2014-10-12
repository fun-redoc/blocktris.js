$(document).ready( function() {
    playGame()
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

function shape(shapeBuilder,x,y,rot,color) {
    shape.prototype.position = function(x,y) {
        return new shape(this.shapeBuilder,  x, y, this.rot, this.color)
    }
    shape.prototype.move = function(x,y) {
        return new shape(this.shapeBuilder, this.pos.x + x, this.pos.y + y, this.rot, this.color)
    }
    shape.prototype.rotateClockwise = function() {
        switch (this.rot) {
            case '0': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "90", this.color); break;
            case '90': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "180", this.color); break;
            case '180': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "270", this.color); break;
            case '270': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "0", this.color);break;
            default:
                return this
        }
    }
    shape.prototype.rotateCounterClockwise = function() {
        switch (this.rot) {
            case '0': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "270", this.color); break;
            case '90': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "0", this.color); break;
            case '180': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "90", this.color);break;
            case '270': return new shape(this.shapeBuilder, this.pos.x, this.pos.y, "180", this.color); break;
            default:
                return this
        }
    }
    console.log(rot)
    this.shapeBuilder = shapeBuilder
    this.pos = {"x":x, "y":y }
    this.rot = rot
    this.color = color
    return this
}

function sprite(shape, $panel) {
    this.shape = shape
    this.$div = $("<div/>")
    this.$panel = $panel

     function emptySprite(sprite) {
       sprite.$div.remove()
       sprite.$div = $("<div/>")
    }

    function spriteFromShape(sprite, shape) {
        emptySprite(sprite)
        drawShapeAt(sprite.$div,sprite.shape,sprite.shape.color)
        sprite.$panel.append( sprite.$div )
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

    sprite.prototype.fall = function(before, after) {
        if( before != undefined ) {
            before()
        }

        this.move(0,1)

        if( after != undefined ) {
            after()
        }
    }

    sprite.prototype.left = function(before, after) {
        if( before != undefined ) {
            before()
        }

        this.move(-1,0)

        if( after != undefined ) {
            after()
        }
    }

    sprite.prototype.right = function(before, after) {
        if( before != undefined ) {
            before()
        }

        this.move(1,0)

        if( after != undefined ) {
            after()
        }
    }

    sprite.prototype.move = function(x,y) {
        this.shape = this.shape.move(x,y)
        spriteFromShape(this)
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
      console.log(event.which)
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
          if( stop === true ) {
              game.continue()
              // gameLoop()
          }
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
  setInterval(game.tick, 1000)
}

function playGame() {
    var $panel = $("div#panel")
    var stop = false
    var sh = new shape(shapeBuilderI,0,0,"0","orange")
    var sp = new sprite(sh,$("div#panel"))
    $panel.append(sp.$div)
    //sp.move(0,0) eigentlich überflüssig weil move relativ verschiebt

    $(document).keydown(function( event ) {
        console.log(event.which)
        if ( event.which == 82 /*r = restart*/ ) {
            stop = false
            sp.startPosition()
            event.preventDefault()
        }
        if ( event.which == 83 /*s = stop*/ ) {
            stop = true
            event.preventDefault()
        }
        if ( event.which == 67 /*c = continue*/ ) {
            if( stop === true ) {
                stop = false
                gameLoop()
            }
            event.preventDefault()
        }
        if ( event.which == 37 /*left*/ ) {
            sp.left()
            event.preventDefault()
        }
        if ( event.which == 39 /*right*/ ) {
            sp.right()
            event.preventDefault()
        }
        if ( event.which == 89 /*y*/ ) {
            sp.rotateCounterClockwise()
            event.preventDefault()
        }
        if ( event.which == 88 /*x*/ ) {
            sp.rotateClockwise()
            event.preventDefault()
        }
    })

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

    var gameLoop = function() {
        if( stop === true ) return

        sp.fall(undefined, function() {
            var bottomBlocks = sp.bottomBlocks()
            console.log(bottomBlocks)
            /*if( touchesBottom(bottomBlocks) ) {
                readyFieldsAdd(sp)
                sp = randomShape()
            } else if (touchesReady(bottomBlocks)) {
                readyFieldAdd(sp)
                sp = randomShape()
            }*/
        })
    }
    setInterval(gameLoop, 1000);
}
