import { StateMachine } from "./state_machine";
import { IState } from "./state";

export let gameStateMachine: StateMachine

export function createGameStateMachine(initState: IState) {
    gameStateMachine = new StateMachine(initState)
}