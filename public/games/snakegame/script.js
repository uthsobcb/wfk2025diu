const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const restartButton = document.getElementById('restartButton');
const scoreElement = document.getElementById('score');

const box = 20;
let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };

let foods = [];
let walls = [];

function addFood() {
    let food;
    do {
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } while (collision(food, snake) || collision(food, foods) || collision(food, walls));
    foods.push(food);
}

while (foods.length < 2) {
    addFood();
}

let score = 0;
let d;

document.addEventListener('keydown', direction);

function direction(event) {
    if (event.keyCode == 37 && d != 'RIGHT') {
        d = 'LEFT';
    } else if (event.keyCode == 38 && d != 'DOWN') {
        d = 'UP';
    } else if (event.keyCode == 39 && d != 'LEFT') {
        d = 'RIGHT';
    } else if (event.keyCode == 40 && d != 'UP') {
        d = 'DOWN';
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'red';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    for (let i = 0; i < foods.length; i++) {
        ctx.fillStyle = 'red';
        ctx.fillRect(foods[i].x, foods[i].y, box, box);
    }

    for (let i = 0; i < walls.length; i++) {
        ctx.fillStyle = 'gray';
        ctx.fillRect(walls[i].x, walls[i].y, box, box);
    }

    if (!d) {
        scoreElement.innerText = 'Score: ' + score;
        return;
    }

    let head = snake[0];
    let newHead = { x: head.x, y: head.y };

    if (d == 'LEFT') newHead.x -= box;
    if (d == 'UP') newHead.y -= box;
    if (d == 'RIGHT') newHead.x += box;
    if (d == 'DOWN') newHead.y += box;

    if (newHead.x < 0 || newHead.x >= canvas.width || newHead.y < 0 || newHead.y >= canvas.height || collision(newHead, snake) || collision(newHead, walls)) {
        clearInterval(game);
        restartButton.style.display = 'block';
        return;
    }

    let eatenFoodIndex = -1;
    for (let i = 0; i < foods.length; i++) {
        if (newHead.x == foods[i].x && newHead.y == foods[i].y) {
            eatenFoodIndex = i;
            break;
        }
    }

    snake.unshift(newHead);

    if (eatenFoodIndex !== -1) {
        score++;
        let eatenFood = foods[eatenFoodIndex];
        foods.splice(eatenFoodIndex, 1);
        walls.push(eatenFood);
        addFood();

        snake.reverse();
        let head = snake[0];
        if (snake.length > 1) {
            let next = snake[1];
            if (next.x < head.x) {
                d = 'RIGHT';
            } else if (next.x > head.x) {
                d = 'LEFT';
            } else if (next.y < head.y) {
                d = 'DOWN';
            } else if (next.y > head.y) {
                d = 'UP';
            }
        }
    } else {
        snake.pop();
    }

    scoreElement.innerText = 'Score: ' + score;
}

let game = setInterval(draw, 160);

function restartGame() {
    snake = [];
    snake[0] = { x: 10 * box, y: 10 * box };

    foods = [];
    walls = [];
    while (foods.length < 2) {
        addFood();
    }

    score = 0;
    d = undefined;

    restartButton.style.display = 'none';
    scoreElement.innerText = 'Score: ' + score;
    game = setInterval(draw, 130);
}

restartButton.addEventListener('click', restartGame);