const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const showLives = document.getElementById('show-lives');
const showScore = document.getElementById('show-score');
const showLevel = document.getElementById('show-level');
const btnStart = document.getElementById('start-game');
const btnPause = document.getElementById('pause-game');
const btnEnd = document.getElementById('end-game');
const sendAlert = document.getElementById('send-alert');
const startCard = document.getElementById('start');

// Canvas limits and game vars
const paddleHeight = canvas.height * 0.025;
let x = canvas.width / 2;
let y = canvas.height - paddleHeight;
let dx = 2;
let dy = -2;
let ballRadius = 3;
let paddleWidth = canvas.width * 0.25;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let score = 0;
let displayScore = 0;
let lives = 3;
let level = 1;
let gameOn = false;
let type;
let msg;
let pauseText = false;
let mySound;

// Brick count
let brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = canvas.width / 6;
const brickHeight = paddleHeight;
const brickPadding = canvas.height * 0.01;
const brickOffsetTop = brickHeight;
const brickOffsetLeft = brickWidth / 2;

// Set number of hits to break a brick
const randomNum = (min, max) => {
	return Math.round(Math.random() * (max - min) + min);
};

// Set random pick up to a brick
const pickList = [ 'life', 'slowdown', 'double', 'speedup', 'xxl', 'xxs', 'none' ];
const selectPick = (pickList) => {
	const randomPick = Math.floor(Math.random() * pickList.length);
	return pickList[randomPick];
};

let bricks = [];
for (c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1, hits: randomNum(1, 3), pickUp: selectPick(pickList) };
	}
}

const renderPickup = (pickUp) => {
	switch (pickUp) {
		case 'life':
			lives++;
			type = 'alert-info';
			msg = '<strong>Extra Life!</strong>';
			time = 2000;
			displayAlert(type, msg, time);
			pickSound.play();
			break;
		case 'slowdown':
			dy /= 2;
			dx /= 2;
			type = 'alert-info';
			msg = '<strong>Ball Slowed Down!</strong>';
			time = 2000;
			displayAlert(type, msg, time);
			pickSound.play();
			setTimeout(() => {
				dy *= 2;
				dx *= 2;
			}, 3000);
			break;
		case 'double':
			paddleWidth *= 2;
			type = 'alert-info';
			msg = '<strong>Double Size!</strong>';
			time = 2000;
			displayAlert(type, msg, time);
			pickSound.play();
			setTimeout(() => {
				paddleWidth = canvas.width * 0.25;
			}, 5500);
			break;
		case 'speedup':
			dy *= 2;
			dx *= 2;
			type = 'alert-info';
			msg = '<strong>Ball Speeded Up!</strong>';
			time = 2500;
			displayAlert(type, msg, time);
			pickSound.play();
			setTimeout(() => {
				dy /= 2;
				dx /= 2;
			}, 3500);
			break;
		case 'xxl':
			ballRadius = 7;
			type = 'alert-info';
			msg = '<strong>Extra Large Ball!</strong>';
			time = 2000;
			displayAlert(type, msg, time);
			pickSound.play();
			setTimeout(() => {
				ballRadius = 3;
			}, 6000);
			break;
		case 'xxs':
			ballRadius = 0.5;
			type = 'alert-info';
			msg = '<strong>Extra Small Ball!</strong>';
			time = 2000;
			displayAlert(type, msg, time);
			pickSound.play();
			setTimeout(() => {
				ballRadius = 3;
			}, 6000);
			break;

		case 'none':
		default:
			return '';
	}
};

// Press key handlers
const keyDownHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	} else if (e.keyCode == 32) {
		spacePressed = true;
		gameOn = true;
		gameStartSound.play();
		startCard.classList.add('invisible');
	}
};

const keyUpHandler = (e) => {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	} else if (e.keyCode == 32) {
		spacePressed = false;
	}
};

// Touchscreen handlers
//		@ to-do

// Mouse move handler
const mouseMoveHandler = (e) => {
	let relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
};

// Controls Event listeners

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

// Play sound
function sound(src) {
	this.sound = document.createElement('audio');
	this.sound.src = src;
	this.sound.setAttribute('preload', 'auto');
	this.sound.setAttribute('controls', 'none');
	this.sound.style.display = 'none';
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	};
	this.stop = function() {
		this.sound.pause();
	};
}

// Sounds
gameStartSound = new sound('./sounds/gameon.mp3');
paddleSound = new sound('./sounds/paddle.mp3');
brickSound = new sound('./sounds/brick.mp3');
lostLiveSound = new sound('./sounds/lostlive.mp3');
nextSound = new sound('./sounds/nextlevel.mp3');
gameOverSound = new sound('./sounds/gameover.mp3');
pickSound = new sound('./sounds/collect.mp3');

// Buttons -->
// Start Game
btnStart.onclick = () => {
	gameOn = true;
	gameStartSound.play();
	btnStart.classList.add('disabled');
	btnStart.setAttribute('disabled', true);
	btnEnd.classList.remove('disabled');
	btnEnd.removeAttribute('disabled');
	startCard.classList.add('invisible');
};

canvas.onclick = () => {
	gameOn = true;
	gameStartSound.play();
	startCard.classList.add('invisible');
};

// Pause Game
btnPause.onclick = () => {
	if (gameOn) {
		gameOn = false;
		pauseText = !pauseText;
	} else {
		gameOn = true;
		pauseText = !pauseText;
	}
	pauseText ? (btnPause.innerText = 'Resume Game') : (btnPause.innerText = 'Pause Game');
};

// End Game
btnEnd.onclick = () => {
	gameOver();
};

// Render elements
const drawBall = () => {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#ffc107';
	ctx.fill();
	ctx.closePath();
};

const drawPaddle = () => {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = '#5cb85c';
	ctx.fill();
	ctx.closePath();
};

const drawBricks = () => {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				if (bricks[c][r].hits === 3) {
					ctx.fillStyle = 'rgba(91, 192, 222, 1)';
				} else if (bricks[c][r] === 2) {
					ctx.fillStyle = 'rgba(91, 192, 222, 0.75)';
				} else {
					ctx.fillStyle = 'rgba(91, 192, 222, 0.3)';
				}
				ctx.fill();
				ctx.closePath();
			}
		}
	}
};

const showStats = (displayScore = 0, lives = 3, level = 1) => {
	showScore.innerText = displayScore;
	showLives.innerText = lives;
	showLevel.innerText = level;
};

const collision = () => {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status === 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.hits--;
					if (b.hits === 0) {
						b.status = 0;
						score++;
						displayScore++;
						renderPickup(b.pickUp);
					}
					brickSound.play();
					if (score == brickRowCount * brickColumnCount) {
						lostLiveSound.stop();
						type = 'alert-success';
						msg = `<strong>Congratulations!</strong> <br/> You have passed Level ${level} with a Score of ${displayScore}`;
						time = 2700;
						displayAlert(type, msg, time);
						nextSound.play();
						nextLevel();
					}
				}
			}
		}
	}
};

const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	if (gameOn) {
		drawBall();
		collision();
		showStats(displayScore, lives, level);
		x += dx;
		y += dy;
		btnStart.classList.add('disabled');
		btnStart.setAttribute('disabled', true);
		btnEnd.classList.remove('disabled');
		btnEnd.removeAttribute('disabled');
	}
	drawPaddle();

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
		paddleSound.play();
	}

	if (y + dy < ballRadius) {
		dy = -dy;
		paddleSound.play();
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
			paddleSound.play();
		} else {
			lives--;
			lostLiveSound.play();

			if (!lives) {
				gameOver();
			} else {
				x = canvas.width / 2;
				y = canvas.height - paddleHeight;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}
	if (gameOn) {
		if (rightPressed && paddleX < canvas.width - paddleWidth) {
			paddleX += 7;
		} else if (leftPressed && paddleX > 0) {
			paddleX -= 7;
		}
	}
	requestAnimationFrame(draw);
};

// Call game
draw();
showStats();

// Next Level
const nextLevel = () => {
	x = canvas.width / 2;
	y = canvas.height - paddleHeight;
	gameOn = false;
	brickRowCount++;
	score = 0;
	level++;
	lives += 2;
	bricks = [];
	for (c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
};

// Game Over
const gameOver = () => {
	gameOverSound.play();
	gameOn = false;
	type = 'alert-danger';
	msg = `<strong>GAME OVER!</strong> <br/> You made it to Level ${level} with a final Score of ${displayScore}`;
	time = 10000;
	displayAlert(type, msg, time);
	setTimeout(() => {
		document.location.reload();
	}, time);
};

// Display Alert message
const displayAlert = (type, msg, time) => {
	sendAlert.innerHTML = msg;
	sendAlert.style.animation = 'show-alert ease-out 3s';
	sendAlert.classList.add(type);
	sendAlert.classList.remove('invisible');
	sendAlert.classList.add('visible');
	setTimeout(() => {
		sendAlert.classList.remove('visible');
		sendAlert.classList.add('invisible');
	}, time);
};
