import './css/styles.css';

document.documentElement.style.setProperty('--actual-height', window.innerHeight + 'px');
document.getElementById('start-game-button').addEventListener('click', handleStartGameClick);


class Game {
  constructor() {
    this.playerScore = 0;
    this.rounds = 0;
    this.sequence = [];
    this.lights = ['north', 'west', 'east', 'south', 'center'];
    this.phase = 'idle';
    this.baseFlashSpeed = 200;
    this.currentFlashSpeed = 200;
  }

  createButtonListeners() {

  }

  async beginGame() {
    // console.log('get ready...');
    // await pause(1000);
    game.addNewRandomStep();
    game.startSequenceDemo();
  }

  addNewRandomStep() {
    if (this.currentFlashSpeed > 50) {
      this.currentFlashSpeed = this.baseFlashSpeed - (this.sequence.length);
    }
    this.sequence.push(this.lights[randomInt(0, this.lights.length - 1)]);
  }

  async startSequenceDemo() {
    this.phase = 'demo';
    console.log('starting sequence', this.sequence.length, 'at', this.currentFlashSpeed)
    for (let i=0; i< this.sequence.length; i++) {
      let step = this.sequence[i];
      await giveClassForDuration(`#${step}-button`, `lit`, this.currentFlashSpeed);
      await pause(this.currentFlashSpeed);
    }
    console.log('ended sequence');
    this.phase = 'waiting';
  }
}

function handleStartGameClick() {
  game.beginGame();
}

const giveClassForDuration = async (query, className, duration) => {
  let element = document.querySelector(query);
  element.classList.add(className);
  await pause(duration);
  element.classList.remove(className);
}

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomArbitrary = (min, max) => Math.random() * (max - min) + min;

let game = new Game();