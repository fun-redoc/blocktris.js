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
