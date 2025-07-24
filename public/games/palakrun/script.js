const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const gameOver = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

let isJumping = false;
let obstacles = [];
let gameSpeed = 5;
let score = 0;
let gameInterval;

function jump() {
    if (isJumping) return;
    isJumping = true;
    player.style.bottom = '150px';
    setTimeout(() => {
        player.style.bottom = '0px';
        isJumping = false;
    }, 500);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
    if (e.code === 'Enter') {
        if (gameOver.style.display === 'flex') {
            startGame();
        }
    }
});

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.right = '0px';
    obstacle.style.height = Math.floor(Math.random() * 40) + 20 + 'px';
    gameContainer.appendChild(obstacle);
    obstacles.push(obstacle);
}

function moveObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        let obstacleRight = parseInt(obstacle.style.right);
        obstacleRight += gameSpeed;
        obstacle.style.right = obstacleRight + 'px';

        if (obstacleRight > window.innerWidth) {
            obstacle.remove();
            obstacles.splice(i, 1);
            score++;
        }

        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top &&
            playerRect.top < obstacleRect.bottom
        ) {
            endGame();
        }
    }

    if (Math.random() < 0.02 && obstacles.length < 3) {
        createObstacle();
    }
}

const scoreElement = document.getElementById('score');

function gameLoop() {
    moveObstacles();
    scoreElement.textContent = `Score: ${score}`;
    requestAnimationFrame(gameLoop);
}

function startGame() {
    obstacles.forEach(obstacle => obstacle.remove());
    obstacles = [];
    score = 0;
    player.style.bottom = '0px';
    gameOver.style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function endGame() {
    gameOver.style.display = 'flex';

}

restartButton.addEventListener('click', startGame);

startGame();
