function blockAt(col, row, color,mark) {
    var $block =  $("<div/>")
        .addClass("block")
        .css({backgroundColor: color})
        .width(BlockSize)
        .height(BlockSize)
        .attr("col", col)
        .attr("row", row)
         // why do i have to leave out the offst coordinates???
        .offset({ top: row*BlockSize, left: col*BlockSize})
        // .offset({ top: row*BlockSize + GameFieldPosY, left: col*BlockSize + GameFieldPosX})
        .html(mark)

    return $block
    // return positionBlock($block, col, row)
}

function drawShapeAt(panel, shape) {
    fn.each( function(pair) {
        panel.append( blockAt(pair.x, pair.y,pair.color, '.'))
    },shape)
}

// +positionBlock :: $div -> x -> y -> $div
var positionBlock = fn.curry(function($div,x,y) {
  // whay do i have to add offset coordinates??
  return $div.offset({ top: y*BlockSize + GameFieldPosY, left: x*BlockSize + GameFieldPosX})
  // return $div.offset({ top: y*BlockSize, left: x*BlockSize })
})

var updateSpriteByShape = function updateSpriteByShape($panel, shape) {
  $panel.children().each(function(idx) {
    positionBlock($(this), shape[idx].x,shape[idx].y)
    $(this).attr("col", shape[idx].x).attr("row", shape[idx].y)
  })
  return $panel
}


var moveSprite = fn.curry(function moveSprite($panel, fromBlock, toBlock) {
    var col = fromBlock.x
    var row = fromBlock.y
    $div = $("div[row=" + row + "][col=" + col + "]")
    positionBlock($div, toBlock.x, toBlock.y)
    $div.attr("row", toBlock.y).attr("col",toBlock.x)
    // TODO some animation (fly away in random direction - ballistically)
    return $div
})


  var removeFromView = fn.curry(function removeFromView($pitchedShapesView, block) {
      var col = block.x
      var row = block.y
      $div = $("div[row=" + row + "][col=" + col + "]")
      // TODO some animation (fly away in random direction - ballistically)
      $div.remove()
  })


var renderFunction = function renderFunction() {
  return function render(world) {
      if($currentShapeLaver.children().size() <= 0) {
        drawShapeAt($currentShapeLaver, world.shape(), world.shape().color)
      } else {
        updateSpriteByShape($currentShapeLaver, world.shape())
      }

      var fallenShapes = world.getFallenShapes()
      if(fallenShapes.length > 0 ) {
          g.map2( function(block, $div) {
              if( !block ) {
                  $($div).remove() // possibly $($div)
              }
              if( !$div ) {
                  $pitchesShapesLayer.append( blockAt(block.x, block.y, block.color, '.'))
              }
              if( $div && block ) {
                positionBlock($($div), block.x, block.y)
                $($div).attr("row", block.y).attr("col",block.x)
              }
          }, fallenShapes, $pitchesShapesLayer.children().toArray())
      }
  }
}
