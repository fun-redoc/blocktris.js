function Game(shapes, $panel) {
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

Game.prototype.tick = function() {
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
Game.prototype.stop = function() {
  //console.log("stop", this.hello)
  this.stopped = true
}
Game.prototype.continue = function() {
  //console.log("continue", this.hello)
  this.stopped = false
}
Game.prototype.restart = function() {
  //console.log("restart", this.hello)
  this.sp.startPosition()
  this.continue()
}
Game.prototype.left = function() {
  //console.log("left", this.hello)
  this.sp.left()
}
Game.prototype.right = function() {
  //console.log("right", this.hello)
  this.sp.right()
}
Game.prototype.rotateCounterClockwise = function() {
  //console.log("rotateCounterClockwise", this.hello)
  this.sp.rotateCounterClockwise()
}
Game.prototype.rotateClockwise = function() {
  //console.log("rotateClockwise", this.hello)
  this.sp.rotateClockwise()
}
