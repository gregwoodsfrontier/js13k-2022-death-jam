import { IState } from './state';

export class StateMachine {
  private currentState: IState;

  constructor(initialState: IState, ...enterArgs: any) {
    this.currentState = initialState;
    this.currentState.onEnter ? this.currentState.onEnter(...enterArgs) : null;
  }

  setState(newState: IState, ...enterArgs: any) {
    this.currentState.onLeave ? this.currentState.onLeave() : null;
    this.currentState = newState;
    this.currentState.onEnter ? this.currentState.onEnter(...enterArgs) : null;
  }

  getState() {
    return this.currentState;
  }
}