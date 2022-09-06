export interface IState {
    onUpdate?: (timeElapsed?: number) => void;
    onRender?: (timeElapsed?: number) => void;
    onEnter?: Function;
    onLeave?: Function;
  }