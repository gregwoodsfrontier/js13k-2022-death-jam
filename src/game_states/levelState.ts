import { IState } from "../state";

class LevelState implements IState {
    onEnter () {
        console.log('Level state on Enter')
    }

    onUpdate () {
        console.log('Level state on Update')
        // put your game logic here
    }

    onRender () {
        
    }
}

export const levelState = new LevelState()