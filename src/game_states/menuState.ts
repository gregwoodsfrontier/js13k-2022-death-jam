import { 
    getCanvas,
    onInput,
    Text
} from "kontra";
import { gameStateMachine } from "../game_state_machine";
import { IState } from "../state";
import { levelState } from "./levelState";

class MenuState implements IState {

    private isGameOver = false
    
    private titleText!: Text;
    private mainText!: Text

    onEnter () {
        this.drawMenu();
        onInput(['enter', 'space'], this.handleInput)
    }

    onRender() {
        if(this.getGameOver === true) {
            this.titleText.text = 'Game Over ?'
            this.mainText.text = 'Press Enter to re-play'
        }
        else if(this.getGameOver === false) {
            this.titleText.text = 'Echo of Depths (Death)'
            this.mainText.text = 'Press Enter to play'
        }

        this.titleText.render()
        this.mainText.render()
    }

    get getGameOver() {
        return this.isGameOver
    }

    set setGameOver(boo: boolean) {
        this.isGameOver = boo
    }

    drawMenu() {
        let canvas = getCanvas()
        this.titleText = Text({
            text: '',
            font: '154px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 - 76,
            anchor: {x: 0.5, y: 0.5}
        })

        this.mainText = Text({
            text: '',
            font: '130px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 + 0,
            anchor: {x: 0.5, y: 0.5}
        })
    }

    handleInput() {
        gameStateMachine.setState(levelState)
    }
}

export const menuState = new MenuState();