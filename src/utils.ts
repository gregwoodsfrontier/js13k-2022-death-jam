import {
  getContext,
  clamp,
  getWorldRect,
  Sprite
} from 'kontra';

///////////////////////////////////////////////////////////////////////////////
/**
 * Draw a pixel using fillRect method
 */
export function drawPixelFill(context: CanvasRenderingContext2D, x: number, y: number, color: string) {
  var roundedX = Math.round(x);
  var roundedY = Math.round(y);
  context.fillStyle = color || '#000';
  context.fillRect(roundedX, roundedY, 1, 1);
}

/**
 * Draw the graphic according to the encrypted data
 * 
 * @param context 
 * @param color_data 
 * @param frame_data 
 * @param _width 
 * @param _height 
 */
export function drawCharacter(context: CanvasRenderingContext2D, color_data: string, frame_data: string, _width: number, _height: number) {
  let c = context
  let C = color_data
  let px = [] as number[]
  for (let a of frame_data) {
      let z = a.charCodeAt(0)
      px.push(z & 7)
      px.push((z >> 3) & 7)
  }
  let W = _width
  let H = _height
  
  for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
          if (px[j * W + i]) {
              // c.fillStyle = "#" + C.substr(6 * (px[j * W + i] - 1), 6)
              let start = 6 * (px[j * W + i] - 1)
              let end = start + 6
              let pos = {
                  x: i - Math.floor(W/2),
                  y: j - Math.floor(H/2)
              }
              c.fillStyle = "#" + C.slice(start, end)
              c.fillRect(pos.x , pos.y , 1, 1)
          }
      }
  }
}

/**
 * Determine if a circle and a circle collide
*/
export function circleCirCollision(circle1: Sprite, circle2: Sprite) {
  if(!circle1.radius || !circle2.radius)
  {
    return
  }
  let dx = circle2.x - circle1.x
  let dy = circle2.y - circle1.y
  let cirAfterScaleR = [circle1.radius * circle1.scaleX, circle2.radius * circle2.scaleX]

  return Math.hypot(dx, dy) < cirAfterScaleR[0] + cirAfterScaleR[1]
}
