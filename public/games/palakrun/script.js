const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const gameOver = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');

let isJumping = false;
let obstacles = [];
let powerups = [];
let gameSpeed = 4;
let score = 0;
let highScore = localStorage.getItem('palakrun-highscore') || 0;
let gameRunning = false;
let animationId;
let speedIncrease = 0;

// Initialize high score display
highScoreElement.textContent = `Best: ${highScore}`;

function jump() {
    if (isJumping || !gameRunning) return;
    isJumping = true;
    player.classList.add('jumping');
    player.style.bottom = '180px';

    setTimeout(() => {
        player.style.bottom = '0px';
        setTimeout(() => {
            isJumping = false;
            player.classList.remove('jumping');
        }, 100);
    }, 400);
}

// Enhanced controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            jump();
        } else if (gameOver.style.display === 'flex') {
            startGame();
        }
    }
    if (e.code === 'Enter' && gameOver.style.display === 'flex') {
        startGame();
    }
});

// Touch controls for mobile
gameContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning) {
        jump();
    }
});

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '0px';
    obstacle.style.height = Math.floor(Math.random() * 60) + 40 + 'px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function createPowerup() {
    const powerup = document.createElement('div');
    powerup.classList.add('powerup');
    powerup.style.right = '0px';
    gameContainer.appendChild(powerup);
    powerups.push(powerup);
}

function moveObstacles() {
    if (!gameRunning) return;

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        let obstacleRight = parseInt(obstacle.style.right);
        obstacleRight += gameSpeed + speedIncrease;
        obstacle.style.right = obstacleRight + 'px';

        // Remove obstacles that are off screen
        if (obstacleRight > window.innerWidth) {
            obstacle.remove();
            obstacles.splice(i, 1);
            score += 10;
        }

        // Collision detection
        if (checkCollision(player, obstacle)) {
            endGame();
            return;
        }
    }

    // Move powerups
    for (let i = powerups.length - 1; i >= 0; i--) {
        const powerup = powerups[i];
        let powerupRight = parseInt(powerup.style.right);
        powerupRight += gameSpeed + speedIncrease;
        powerup.style.right = powerupRight + 'px';

        // Remove powerups that are off screen
        if (powerupRight > window.innerWidth) {
            powerup.remove();
            powerups.splice(i, 1);
        }

        // Powerup collection
        if (checkCollision(player, powerup)) {
            powerup.remove();
            powerups.splice(i, 1);
            score += 50;
            // Visual feedback for powerup collection
            player.style.transform = 'scale(1.2)';
            setTimeout(() => {
                player.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // Create new obstacles
    if (Math.random() < 0.015 && obstacles.length < 2) {
        createObstacle();
    }

    // Create powerups occasionally
    if (Math.random() < 0.005 && powerups.length < 1) {
        createPowerup();
    }
}

function checkCollision(rect1Element, rect2Element) {
    const rect1 = rect1Element.getBoundingClientRect();
    const rect2 = rect2Element.getBoundingClientRect();

    // More precise collision detection with smaller hitboxes
    const margin = 8;
    return (
        rect1.right - margin > rect2.left + margin &&
        rect1.left + margin < rect2.right - margin &&
        rect1.bottom - margin > rect2.top + margin &&
        rect1.top + margin < rect2.bottom - margin
    );
}

function gameLoop() {
    if (!gameRunning) return;

    moveObstacles();

    // Increase difficulty gradually
    speedIncrease = Math.floor(score / 200) * 0.5;

    // Update score display
    scoreElement.textContent = `Score: ${score}`;

    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    // Stop any existing game loop
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Clear obstacles and powerups
    obstacles.forEach(obstacle => obstacle.remove());
    powerups.forEach(powerup => powerup.remove());
    obstacles = [];
    powerups = [];

    // Reset game state
    score = 0;
    speedIncrease = 0;
    gameRunning = true;
    player.style.bottom = '0px';
    player.style.transform = 'scale(1)';
    gameOver.style.display = 'none';

    // Start game loop
    gameLoop();
}

function endGame() {
    gameRunning = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('palakrun-highscore', highScore);
        highScoreElement.textContent = `Best: ${highScore}`;
    }

    // Show game over screen
    finalScoreElement.textContent = score;
    gameOver.style.display = 'flex';
}

restartButton.addEventListener('click', startGame);

// Start the game initially
startGame();
