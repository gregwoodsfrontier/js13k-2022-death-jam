import { 
  init,
  GameLoop,
  initKeys
} from 'kontra';
import { menuState } from './game_states/menuState';
import { createGameStateMachine, gameStateMachine } from './game_state_machine';
import { levelState } from './game_states/levelState';

function main() {

  // globals
  // let location, score, lives

  initKeys()

  let { canvas, context } = init();

  canvas.width = 640
  canvas.height = 640

  createGameStateMachine(menuState)
  gameStateMachine.setState(menuState, false)
  // testMethod()

  ///////////////////////////////////////////////////////////////////////////////

  function testMethod() {
    gameStateMachine.setState(levelState)
  }

  function gameUpdate() {
    gameStateMachine.getState().onUpdate()
  }

  function gameRender() {
    gameStateMachine.getState().onRender()
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Startup GameLoop
  const loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  })

  loop.start()

}

main()