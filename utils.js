import {
    getContext,
    clamp,
    getWorldRect
  } from 'kontra';
  
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * Draw a rounded rectangle
   */
  export function roundRect(x, y, w, h, r, color) {
    let context = getContext();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + w, y, x + w, y + h, r);
    context.arcTo(x + w, y + h, x, y + h, r);
    context.arcTo(x, y + h, x, y, r);
    context.arcTo(x, y, x + w, y, r);
    context.fill();
  }
  
  ///////////////////////////////////////////////////////////////////////////////
  /**
   * Determine if a circle and a rectangle collide
   */
  export function circleRectCollision(circle, rect) {
    let { x, y, width, height } = getWorldRect(rect);
  
    let dx = circle.x - clamp(x, x + width, circle.x);
    let dy = circle.y - clamp(y, y+ height, circle.y);
    return dx * dx + dy * dy < circle.radius * circle.radius;
  }