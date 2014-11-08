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

function updateSpriteByShape($panel, shape) {
  $panel.children().each(function(idx) {
    positionBlock($(this), shape[idx].x,shape[idx].y)
    $(this).attr("col", shape[idx].x).attr("row", shape[idx].y)
  })
  return $panel
}


var renderFunction = function renderFunction($panel) {
  return function render(world) {
      if($panel.children().size() <= 0) {
        drawShapeAt($panel, world.shape(), world.shape().color)
      } else {
        updateSpriteByShape($panel, world.shape())
      }
  }
}
