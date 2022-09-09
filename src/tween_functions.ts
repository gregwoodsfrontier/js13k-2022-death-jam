export type TweenParams = {
    t: number,
    b: number,
    _c: number,
    d: number
}

// t: current time, b: beginning value, _c: final value, d: total duration
export const tweenFunctions = {
  linear: function(_params: TweenParams) {
    let { t, b, _c, d } = _params
    let c = _c - b;
    return c * t / d + b;
  },
  easeInQuad: function(_params: TweenParams) {
    let { t, b, _c, d } = _params
    let c = _c - b;
    return c * (t /= d) * t + b;
  },
  easeOutQuad: function(_params: TweenParams) {
    let { t, b, _c, d } = _params
    let c = _c - b;
    return -c * (t /= d) * (t - 2) + b;
  },
  easeInOutQuad: function(_params: TweenParams) {
    let { t, b, _c, d } = _params
    let c = _c - b;
    if ((t /= d / 2) < 1) {
      return c / 2 * t * t + b;
    } else {
      return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
  }
};
