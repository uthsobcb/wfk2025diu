const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let carX = canvas.width / 2 - 25;
let carY = canvas.height - 60;
const carWidth = 50;
const carHeight = 50;
let carSpeed = 5;

let obstacles = [];
let score = 0;
let gameOver = false;

function drawCar() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, carY, carWidth, carHeight);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function update() {
    if (gameOver) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move obstacles
    obstacles.forEach(obstacle => {
        obstacle.y += 5;
    });

    // Remove obstacles that are off-screen
    obstacles = obstacles.filter(obstacle => obstacle.y < canvas.height);

    // Add new obstacles
    if (Math.random() < 0.05) {
        const obstacleX = Math.random() * (canvas.width - 30);
        obstacles.push({ x: obstacleX, y: 0, width: 30, height: 30 });
    }

    // Check for collisions
    obstacles.forEach(obstacle => {
        if (
            carX < obstacle.x + obstacle.width &&
            carX + carWidth > obstacle.x &&
            carY < obstacle.y + obstacle.height &&
            carY + carHeight > obstacle.y
        ) {
            gameOver = true;
        }
    });

    // Update score
    if (!gameOver) {
        score++;
    }

    drawCar();
    drawObstacles();

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    if (gameOver) {
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
    }

    requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && carX > 0) {
        carX -= carSpeed;
    } else if (e.key === 'ArrowRight' && carX < canvas.width - carWidth) {
        carX += carSpeed;
    }
});

update();