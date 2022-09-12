import { 
    getCanvas,
    offInput,
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
    private instruct!: Text
    private instructB!: Text

    onEnter (isGameOver: boolean) {
        this.isGameOver = isGameOver
        this.drawMenu();
        onInput(['enter', 'space'], this.handleInput)
    }

    onUpdate() {

    }

    onRender() {
        // this.drawMenu();
        // onInput(['enter', 'space'], this.handleInput)

        if(this.getGameOver === true) {
            this.titleText.text = 'Game Over ?'
            this.mainText.text = 'Press Enter to re-play'
        }
        else if(this.getGameOver === false) {
            this.titleText.text = 'Echo of Depths / Death'
            this.mainText.text = 'Press Enter to play'
        }

        this.titleText.render()
        this.mainText.render()
        this.instruct.render()
        this.instructB.render()
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
            text: 'a',
            font: '44px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 - 76,
            anchor: {x: 0.5, y: 0.5}
        })

        this.mainText = Text({
            text: 'b',
            font: '30px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 + 0,
            anchor: {x: 0.5, y: 0.5}
        })

        this.instruct = Text({
            text: '<- to turn clock, -> to turn anti-clock',
            font: '30px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 + 100,
            anchor: {x: 0.5, y: 0.5}
        })

        this.instructB = Text({
            text: 'Get more points!!',
            font: '30px Arial',
            color: 'white',
            x: canvas.width / 2,
            y: canvas.height / 2 + 150,
            anchor: {x: 0.5, y: 0.5}
        })
    }

    handleInput() {
        gameStateMachine.setState(levelState)
        offInput(['enter', 'space'])
    }
}

export const menuState = new MenuState();