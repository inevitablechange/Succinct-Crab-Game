const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
let snake = [];
let food = {};
let score = 0;
let gameInterval;
let currentDirection = "RIGHT";
let gameOver = false;

const snakeHeadImg = new Image();
snakeHeadImg.src = "../assets/Succinct_crab.png";

const foodImg = new Image();
foodImg.src = "../assets/Succinct_logo.svg";

const SERVER_URL = "http://localhost:3000";

function init() {
  snake = [{ x: 5, y: 5 }];
  score = 0;
  currentDirection = "RIGHT";
  gameOver = false;
  generateFood();
  document.getElementById("score").innerText = "Score: " + score;
  document.getElementById("proofBtn").disabled = true;
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 150);
}

function gameLoop() {
  if (gameOver) return;
  update();
  draw();
}

function update() {
  const head = { ...snake[0] };
  switch (currentDirection) {
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
  }

  if (
    head.x < 0 ||
    head.x >= canvasWidth / gridSize ||
    head.y < 0 ||
    head.y >= canvasHeight / gridSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").innerText = "Score: " + score;
    generateFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#191919";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    const segment = snake[i];
    if (i === 0) {
      if (snakeHeadImg.complete) {
        ctx.drawImage(
          snakeHeadImg,
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      } else {
        ctx.fillStyle = "green";
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      }
    } else {
      // 꼬리: 먹이 이미지 사용
      if (foodImg.complete) {
        ctx.drawImage(
          foodImg,
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      } else {
        ctx.fillStyle = "red";
        ctx.fillRect(
          segment.x * gridSize,
          segment.y * gridSize,
          gridSize,
          gridSize
        );
      }
    }
  }

  if (foodImg.complete) {
    ctx.drawImage(
      foodImg,
      food.x * gridSize,
      food.y * gridSize,
      gridSize,
      gridSize
    );
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }
}

function generateFood() {
  let attempts = 0;
  do {
    food = {
      x: Math.floor(Math.random() * (canvasWidth / gridSize)),
      y: Math.floor(Math.random() * (canvasHeight / gridSize)),
    };
    attempts++;
    if (attempts > 100) {
      console.warn("Failed to generate food after 100 attempts.");
      return;
    }
  } while (
    snake.some((segment) => segment.x === food.x && segment.y === food.y)
  );
}

function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  alert("Game Over! Final Score: " + score);
  document.getElementById("proofBtn").disabled = false;
  document.getElementById("score").innerText = "Final Score: " + score;
}

document.addEventListener("keydown", function (e) {
  switch (e.key) {
    case "ArrowLeft":
      if (currentDirection !== "RIGHT") currentDirection = "LEFT";
      break;
    case "ArrowRight":
      if (currentDirection !== "LEFT") currentDirection = "RIGHT";
      break;
    case "ArrowUp":
      if (currentDirection !== "DOWN") currentDirection = "UP";
      break;
    case "ArrowDown":
      if (currentDirection !== "UP") currentDirection = "DOWN";
      break;
  }
});

document.getElementById("resetBtn").addEventListener("click", function () {
  init();
});

document
  .getElementById("proofBtn")
  .addEventListener("click", async function () {
    try {
      const response = await fetch(`${SERVER_URL}/api/generate-proof`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: score }),
      });
      const data = await response.json();
      alert("Proof generated successfully!\nProof ID: " + data.proofId);
    } catch (err) {
      console.error("Proof generation error:", err);
      alert("Proof generation failed.");
    }
  });

window.onload = init;
