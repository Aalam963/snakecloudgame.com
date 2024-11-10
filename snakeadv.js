// Get elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");
const retryBtn = document.getElementById("retryBtn");

const gridSize = 20;
let snake = [{ x: 8, y: 8 }];
let food = generateFood();
let direction = 'RIGHT';
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;

// Display high score on page load
highScoreElement.innerText = highScore;

// Functions
function gameLoop() {
  moveSnake();
  checkCollision();
  updateCanvas();
  checkFoodCollision();
  updateScore();
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? 'green' : 'lightgreen';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = { ...snake[0] };

  if (direction === 'RIGHT') head.x++;
  else if (direction === 'LEFT') head.x--;
  else if (direction === 'UP') head.y--;
  else if (direction === 'DOWN') head.y++;

  snake.unshift(head); // Add new head
  snake.pop(); // Remove tail
}

function checkCollision() {
  const head = snake[0];
  
  // Wall collision
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    endGame();
  }

  // Self-collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame();
    }
  }
}

function checkFoodCollision() {
  const head = snake[0];
  
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    snake.push({}); // Add a new segment to the snake
    food = generateFood(); // Generate new food
  }
}

function generateFood() {
  let foodX = Math.floor(Math.random() * (canvas.width / gridSize));
  let foodY = Math.floor(Math.random() * (canvas.height / gridSize));
  return { x: foodX, y: foodY };
}

function updateScore() {
  scoreElement.innerText = score;
  if (score > highScore) {
    highScore = score;
    highScoreElement.innerText = highScore;
    localStorage.setItem('highScore', highScore);
  }
}

function endGame() {
  clearInterval(gameInterval);
  retryBtn.style.display = 'block';
}

function retryGame() {
  snake = [{ x: 8, y: 8 }];
  food = generateFood();
  direction = 'RIGHT';
  score = 0;
  retryBtn.style.display = 'none';
  gameInterval = setInterval(gameLoop, 100);
}

function handleKeyboard(event) {
  if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

function handleTouch(event) {
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;
  const centerX = canvas.offsetLeft + canvas.width / 2;
  const centerY = canvas.offsetTop + canvas.height / 2;

  if (touchX < centerX && touchY < centerY && direction !== 'DOWN') {
    direction = 'UP';
  } else if (touchX < centerX && touchY > centerY && direction !== 'UP') {
    direction = 'DOWN';
  } else if (touchX > centerX && touchY < centerY && direction !== 'RIGHT') {
    direction = 'LEFT';
  } else if (touchX > centerX && touchY > centerY && direction !== 'LEFT') {
    direction = 'RIGHT';
  }
}

// Event listeners for keyboard and touch
document.addEventListener('keydown', handleKeyboard);
canvas.addEventListener('touchstart', handleTouch);

// Start game on page load
gameInterval = setInterval(gameLoop, 100);
retryBtn.style.display = 'none'; // Hide retry button initially
