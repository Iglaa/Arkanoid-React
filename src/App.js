import React, { Component } from 'react';
import './App.css';

const ROWS_COLORS = ["#66a3ff","#4d94ff","#3385ff","#1a75ff","#0066ff","#005ce6","#0052cc","#0047b3","#003d99"]

const COLORS = ["#ff9999","#ffb399","#ffcc99","#ffe699","#ffff99","#e6ff99","#ccff99","#b3ff99","#99ff99","#99ffb3","#99ffcc","#99ffe6"
,"#99ffff","#99e6ff","#99ccff","#99b3ff","#9999ff","#b399ff","#cc99ff","#e699ff","#ff99ff","#ff99e6","#ff99cc","#ff99b3","#ff9999"];

const BOARD_WIDTH        = window.innerWidth;
const BOARD_HEIGHT       = window.innerHeight;

const PADDLE_WIDTH       = 100;
const PADDLE_HEIGHT      = 15;
const PADDLE_STEP_SIZE   = 30;
const PADDLE_TOP         = window.innerHeight*0.9;
const PADDLE_LEFT        = (BOARD_WIDTH/2)-(PADDLE_WIDTH/2);

const PLATE_HEIGHT       = 15;
const PLATE_WIDTH        = window.innerWidth*0.15;

const DEFAULT_BALL_COLOR = '#ccff99';
const DEFAULT_BALL_SIZE  = 20;
const DEFAULT_BALL_LEFT  = (BOARD_WIDTH/4)-(DEFAULT_BALL_SIZE/2);
const DEFAULT_BALL_TOP   = (BOARD_HEIGHT/4)-(DEFAULT_BALL_SIZE/2);

const BALL_STEP_SIZE = 2;

const START_TEXT = 'Welcome! Press button to start.'

class Arkanoid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paddleLeftPosition: PADDLE_LEFT,
      paddleTopPosition: PADDLE_TOP,
      ballTopPosition: DEFAULT_BALL_TOP,
      ballLeftPosition: DEFAULT_BALL_LEFT,
      leftStepSize: BALL_STEP_SIZE,
      topStepSize: BALL_STEP_SIZE,
      ballSize: DEFAULT_BALL_SIZE,
      ballColor: DEFAULT_BALL_COLOR,
      plateWidth: PLATE_WIDTH,
      plateHeight: PLATE_HEIGHT,
      platePositions: [],
      buttonDisplay: 'inline-block',
      ballDisplay: 'block',
      buttonText: 'Start',
      text: START_TEXT,
      textDisplay: 'inline-block',
      score: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.startGame = this.startGame.bind(this);
    this.gameLoop = this.gameLoop.bind(this);
    this.pickColor = this.pickColor.bind(this);
    this.toggelY = this.toggelY.bind(this);
    this.toggelX = this.toggelX.bind(this);
    this.calculatePlatePositions = this.calculatePlatePositions.bind(this);
    this.checkWon = this.checkWon.bind(this);
    this.checkFail = this.checkFail.bind(this);
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown, false);
    this.calculatePlatePositions();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false);
  }

  handleKeyDown = (event) => {
    if (event.keyCode === 39 && (this.state.paddleLeftPosition + PADDLE_STEP_SIZE) <= BOARD_WIDTH - PADDLE_WIDTH){
      this.setState({paddleLeftPosition: (this.state.paddleLeftPosition + PADDLE_STEP_SIZE)})
    } else if (event.keyCode === 37 && (this.state.paddleLeftPosition - PADDLE_STEP_SIZE) >= 0) {
      this.setState({paddleLeftPosition: (this.state.paddleLeftPosition - PADDLE_STEP_SIZE)})
    }
  }

  startGame(text) {
    if (this.state.buttonText === 'Restart') {
      this.setState({ballTopPosition: DEFAULT_BALL_TOP})
      this.setState({ballLeftPosition: DEFAULT_BALL_LEFT})
      this.setState({ballDisplay: 'block'})
      this.setState({score: 0})
      if (this.state.ballTopPosition === DEFAULT_BALL_TOP){
        this.setState({buttonDisplay: 'none'})
        this.setState({textDisplay: 'none'})
        this.calculatePlatePositions();
        this.gameLoop();
      } else {
        this.setState({ballTopPosition: DEFAULT_BALL_TOP})
        this.setState({ballLeftPosition: DEFAULT_BALL_LEFT})
        this.startGame()
      }
    } else if (this.state.buttonText === 'Start'){
      this.setState({buttonDisplay: 'none'})
      this.setState({textDisplay: 'none'})
      this.gameLoop();
    }
  }

  pickColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  toggelY() {
    this.setState({topStepSize: -this.state.topStepSize})
  }

  toggelX() {
    this.setState({leftStepSize: -this.state.leftStepSize})
  }

  calculatePlatePositions() {
    const amount = Math.floor(BOARD_WIDTH/(PLATE_WIDTH+2+50))
    const rows = Math.floor((BOARD_HEIGHT/4)/(PLATE_HEIGHT+2))/2
    const arr = [];
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < amount; j++) {
        arr.push([(i*(PLATE_HEIGHT+2) + 10*PLATE_HEIGHT), (j*(PLATE_WIDTH+2) + ((BOARD_WIDTH - (amount*PLATE_WIDTH))/2)), ROWS_COLORS[i]])
      }
    }
    this.setState({platePositions: arr})
  }

  checkWon() {
    return this.state.platePositions.length === 0 ? true : false
  }
  checkFail() {
    return this.state.ballTopPosition > (PADDLE_TOP + PADDLE_HEIGHT) ? true : false
  }

  gameLoop() {
    if (this.state.ballLeftPosition >= (BOARD_WIDTH - DEFAULT_BALL_SIZE - BALL_STEP_SIZE) || this.state.ballLeftPosition <= 0){
      this.toggelX()
      this.setState({ballColor: this.pickColor()})
    }

    if (this.state.ballTopPosition <= 0){
      this.toggelY()
      this.setState({ballColor: this.pickColor()})
    }

    if (this.state.ballTopPosition >= (PADDLE_TOP - (DEFAULT_BALL_SIZE/2) - PADDLE_HEIGHT) && this.state.ballLeftPosition >= this.state.paddleLeftPosition && this.state.ballLeftPosition <= (this.state.paddleLeftPosition + 100)){
      this.toggelY()
      this.setState({ballColor: this.pickColor()})
    }

    for (var i = 0; i < this.state.platePositions.length; i++) {
      if ((this.state.ballTopPosition + DEFAULT_BALL_SIZE) >= this.state.platePositions[i][0] && (this.state.ballTopPosition) <= (this.state.platePositions[i][0] + PLATE_HEIGHT)
      && (this.state.ballLeftPosition + DEFAULT_BALL_SIZE) >= this.state.platePositions[i][1] && this.state.ballLeftPosition <= (this.state.platePositions[i][1] + PLATE_WIDTH)) {
        this.state.platePositions.splice(i, 1);
        this.setState({ballColor: this.pickColor()})
        this.setState({score: this.state.score + 100})
        this.toggelY()
      }
    }

    this.setState({ballTopPosition: (this.state.ballTopPosition + this.state.topStepSize)})
    this.setState({ballLeftPosition: (this.state.ballLeftPosition + this.state.leftStepSize)})
    if (this.checkWon()) {
      console.log('won')
      this.setState({ballDisplay: 'none'})
      this.setState({buttonDisplay: 'inline-block'})
      this.setState({textDisplay: 'inline-block'})
      this.setState({text: 'You Won!'})
      this.setState({buttonText: 'Restart'})
    } else if (this.checkFail()) {
      console.log('fail')
      this.setState({ballDisplay: 'none'})
      this.setState({buttonDisplay: 'inline-block'})
      this.setState({textDisplay: 'inline-block'})
      this.setState({text: 'GAME OVER'})
      this.setState({buttonText: 'Restart'})
    } else {
      setTimeout(function() { this.gameLoop(); }.bind(this), 0);
    }

  }
  render() {
    return (
      <div className="App">
        <div className="Arkanoid-Board" style={{width: `${BOARD_WIDTH}px`, height: `${BOARD_HEIGHT}px`}}>
          <Text className="Text" display={this.state.textDisplay}>{this.state.text}</Text>
          <Paddle className="Paddle" leftPosition={this.state.paddleLeftPosition} topPosition={this.state.paddleTopPosition}></Paddle>
          <Plate
            className="Plate"
            platePositions={this.state.platePositions}
            plateWidth={this.state.plateWidth}
            plateHeight={this.state.plateHeight}
            >
          </Plate>
          <Ball
            className="Ball"
            ballTopPosition={this.state.ballTopPosition}
            ballLeftPosition={this.state.ballLeftPosition}
            onClick={this.state.gameLoop}
            ballSize={this.state.ballSize}
            ballColor={this.state.ballColor}
            display={this.state.ballDisplay}>
          </Ball>
          <Button
            onClick={() => { this.startGame(); } }
            className="Button"
            display={this.state.buttonDisplay}
          >
            {this.state.buttonText}
          </Button>
          <div className='Signature' style={{position: 'absolute', top: `${BOARD_HEIGHT-20}px`, left: `${BOARD_WIDTH - 190}px`,color: 'white'}}>Created by: Karol Igielski</div>
          <div className='Score' style={{position: 'absolute', top: `${BOARD_HEIGHT-20}px`, left: '5px',color: 'white'}}>Your score: {this.state.score}</div>
        </div>
      </div>
    );
  }
}

const Text = ({className, children, display}) => {  return (
  <div className={className}
    style={{position: 'absolute', textAlign: 'center',left: '0', width: '100%', marginTop: `${(window.innerHeight/2) - 100}px`, fontSize: '60px', display: `${display}`, color: 'white'}}
    >
    {children}
  </div>);
}
const Paddle = ({className, leftPosition, topPosition}) => {  return (<div className={className} style={{left: `${leftPosition}px`, top: `${topPosition}px`}}></div>); }
const Plate = ({className, platePositions, plateWidth, plateHeight}) => {
  return (
    <div>
      {platePositions.map((item, index) =>
      <div className={className} key={index} style={{left: `${item[1]}px`, top: `${item[0]}px`, width: `${plateWidth}px`, height: `${plateHeight}px`, backgroundColor: `${item[2]}`}}></div>
    )}
    </div>
  )
}
const Ball = ({className, ballLeftPosition, ballTopPosition, onClick, ballSize, ballColor, display}) => {
  return (<div className={className}
    style={{left: `${ballLeftPosition}px`, top: `${ballTopPosition}px`, width: `${ballSize}px`, height: `${ballSize}px`, backgroundColor: `${ballColor}`, display: `${display}`}}
    onClick={onClick}>
    </div>);
}
const Button = ({onClick, className, display, children}) => {
  return (
    <div style={{position: 'absolute', textAlign: 'center',left: '0',width: '100%', marginTop: `${window.innerHeight/2}px`, display: `${display}`}}>
      <button
        onClick={onClick}
        className={className}
        type="button"
        style={{fontSize: '20px'}}
      >
        {children}
      </button>
    </div>
  );
}

export default Arkanoid;
