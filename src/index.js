import './css/styles.css';

document.documentElement.style.setProperty('--actual-height', window.innerHeight + 'px');
document.getElementById('start-game-button').addEventListener('click', handleStartGameClick);


class Game {
  constructor() {
    this.playerScore = 0;
    this.sequence = [];
    this.playerSequence = [];
    this.lights = ['north', 'west', 'east', 'south', 'center'];
    this.phase = 'idle';
    this.baseFlashSpeed = 300;
    this.currentFlashSpeed = this.baseFlashSpeed;
  }

  createGameButtonHandlers() {
    [...document.getElementsByClassName('game-button')].forEach(buttonElement => {
      buttonElement.addEventListener('pointerdown', async e => {
        giveClassForDuration(`#${e.target.id}`, `lit`, 200);
        this.playerSequence.push(buttonElement.id.split('-')[0]);
        if (this.checkPlayerSequence()) {
          if (this.playerSequence.length === this.sequence.length) {
            giveClassForDuration(`main`, `won`, 800);
            await this.displayMessage(`#game-message`, `ROUND CLEARED!`, 1200);
            await pause(500);
            await this.startTurn();
          } else {
            this.displayMessage(`#game-message`, `CORRECT`, 400);
          }
        } else {
          giveClassForDuration(`main`, `lost`, 800);
          this.displayMessage(`#game-message`, `WRONG`);
          document.querySelector('main').classList.replace('waiting', 'demo');
          await pause(1600);
          await this.displayMessage(`#game-message`, `GAME OVER`, 2000);
          this.sequence = [];
          this.playerSequence = [];
          this.playerScore = 0;
          this.currentFlashSpeed = 200;
          document.getElementById('start-game-button').classList.remove('hidden');
          document.querySelector('main').classList.replace('demo', 'idle');
        }
      });
    });
  }

  async displayMessage(targetQuery, message, duration) {
    let target = document.querySelector(targetQuery);
    target.innerText = message;
    target.classList.remove('hidden');
    if (duration) {
      await pause(duration);
      target.classList.add('hidden');
    }
  }

  async beginGame(e) {
    e.target.classList.add('hidden');
    game.createGameButtonHandlers();
    this.startTurn();
  }

  async startTurn() {
    await this.displayMessage(`#game-message`, `GET READY...`, 1200);
    await pause(800);
    this.playerSequence = [];
    game.addNewRandomStep();
    game.startSequenceDemo();
  }

  addNewRandomStep() {
    if (this.currentFlashSpeed > 80) {
      this.currentFlashSpeed = this.baseFlashSpeed - (this.sequence.length);
    }
    this.sequence.push(this.lights[randomInt(0, this.lights.length - 1)]);
  }

  async startSequenceDemo() {
    document.querySelector('main').classList.replace('idle', 'demo');
    document.querySelector('main').classList.replace('waiting', 'demo');
    await pause(500);
    for (let i=0; i< this.sequence.length; i++) {
      let step = this.sequence[i];
      await giveClassForDuration(`#${step}-button`, `lit`, this.currentFlashSpeed);
      await pause(this.currentFlashSpeed);
    }
    await pause(500);
    document.querySelector('main').classList.replace('demo', 'waiting');
    await pause(500);
    this.displayMessage(`#game-message`, `REPEAT SEQUENCE`, 1000);
  }

  checkPlayerSequence() {
    let match = true;
    for (const stepIndex in this.playerSequence) {
      let step = this.playerSequence[stepIndex];
      if (this.sequence[stepIndex] !== step) {
        match = false;
        break;
      }
    }
    return match;
  }
}

function handleStartGameClick(e) {
  game.beginGame(e);
}

const giveClassForDuration = async (query, className, duration) => {
  let element = document.querySelector(query);
  element.classList.add(className);
  await pause(duration);
  element.classList.remove(className);
};

const pause = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let game = new Game();