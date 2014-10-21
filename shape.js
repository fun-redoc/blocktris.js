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
    //+ blocks :: shape -> [{x,y}]
    shape.prototype.blocks = function() {
      return this.shapeBuilder()[this.rot].reduce( function(accuRow, row, idxRow) {
        return accuRow.concat(row.reduce( function(accu, col, idxCol) {
          return col !== 0 ? accu.concat({x:idxCol + this.pos.x, y:idxRow + this.pos.y}) : accu;
        },[]))
      }, [])
    }
    this.shapeBuilder = shapeBuilder
    this.pos = {"x":x || 0, "y":y||0 }
    this.rot = rot || '0'
    this.color = color ||'grey'
    return this
}
