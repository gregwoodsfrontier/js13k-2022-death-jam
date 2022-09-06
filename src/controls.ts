class Controls {
    isUp = false;
    isDown = false;
    isLeft = false;
    isRight = false;
    isEnter = false;
    isEscape = false;
  
    constructor() {
      document.addEventListener('keydown', event => this.toggleKey(event, true));
      document.addEventListener('keyup', event => this.toggleKey(event, false))
    }
  
    private toggleKey(event: KeyboardEvent, isPressed: boolean) {
      switch (event.code) {
        case 'KeyW':
          this.isUp = isPressed;
          break;
        case 'KeyS':
          this.isDown = isPressed;
          break;
        case 'KeyA':
          this.isLeft = isPressed;
          break;
        case 'ArrowLeft':
            this.isLeft = isPressed;
            break;
        case 'KeyD':
          this.isRight = isPressed;
          break;
        case 'ArrowRight':
            this.isRight = isPressed;
            break;
        case 'Enter':
          this.isEnter = isPressed;
          break;
        case 'Escape':
          this.isEscape = isPressed;
      }
    }
  }
  
  export const controls = new Controls();