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

/**
 * Draw a rounded rectangle
 */
/* export function roundRect(x, y, w, h, r, color) {
  let context = getContext();
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + w, y, x + w, y + h, r);
  context.arcTo(x + w, y + h, x, y + h, r);
  context.arcTo(x, y + h, x, y, r);
  context.arcTo(x, y, x + w, y, r);
  context.fill();
} */

///////////////////////////////////////////////////////////////////////////////
/**
 * Determine if a circle and a rectangle collide
 */
/* export function circleRectCollision(circle, rect) {
  let { x, y, width, height } = getWorldRect(rect);

  let dx = circle.x - clamp(x, x + width, circle.x);
  let dy = circle.y - clamp(y, y+ height, circle.y);
  return dx * dx + dy * dy < circle.radius * circle.radius;
} */