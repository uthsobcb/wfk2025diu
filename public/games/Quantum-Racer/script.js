const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// UI Elements
const startScreen = document.getElementById('start-screen');
const trackSelectionScreen = document.getElementById('track-selection-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const pauseScreen = document.getElementById('pause-screen');
const countdownScreen = document.getElementById('countdown');
const hud = document.getElementById('hud');

// Buttons
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const newGameButton = document.getElementById('new-game-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');

// HUD Displays
const speedElement = document.getElementById('speed');
const timeElement = document.getElementById('time');
const lapElement = document.getElementById('lap');
const positionElement = document.getElementById('position');
const finalTimeElement = document.getElementById('final-time');
const countdownText = document.getElementById('countdown-text');

canvas.width = 800;
canvas.height = 600;

const collisionCanvas = document.createElement('canvas');
collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;
const collisionCtx = collisionCanvas.getContext('2d');

const sounds = {
    engine: new Audio('sounds/engine.wav'),
    collision: new Audio('sounds/collision.wav'),
    click: new Audio('sounds/click.wav')
};
sounds.engine.loop = true;

let gameState = 'start';
let player, opponents, obstacles, track, selectedTrackId = 0;
let keys = {};
let startTime, elapsedTime = 0, pausedTime = 0;
let animationFrameId;

const tracks = [
    {
        name: "Easy Rider",
        path: [
            { x: 100, y: 500 }, { x: 400, y: 500 }, { x: 700, y: 400 },
            { x: 700, y: 200 }, { x: 400, y: 100 }, { x: 100, y: 200 },
            { x: 100, y: 500 }
        ],
        width: 80,
        obstacles: []
    },
    {
        name: "Twisty Pro",
        path: [
            { x: 400, y: 550 }, { x: 650, y: 450 }, { x: 700, y: 250 },
            { x: 550, y: 100 }, { x: 250, y: 100 }, { x: 100, y: 250 },
            { x: 150, y: 450 }, { x: 400, y: 550 }
        ],
        width: 70,
        obstacles: []
    }
];
const totalLaps = 3;

function init() {
    track = tracks[selectedTrackId];
    drawTrackCollisionMap();

    player = {
        x: track.path[0].x + 15, y: track.path[0].y, width: 18, height: 36,
        speed: 0, maxSpeed: 10, acceleration: 0.15, friction: 0.08,
        angle: Math.atan2(track.path[1].y - track.path[0].y, track.path[1].x - track.path[0].x),
        turnSpeed: 0.06, lap: 0, checkpoint: 0, distance: 0
    };

    opponents = [];
    for (let i = 0; i < 3; i++) {
        opponents.push({
            x: track.path[0].x - 15 * (i + 1), y: track.path[0].y,
            width: 18, height: 36, speed: Math.random() * 1.5 + 5.5,
            angle: Math.atan2(track.path[1].y - track.path[0].y, track.path[1].x - track.path[0].x),
            targetPoint: 1, distance: 0
        });
    }

    obstacles = track.obstacles;
    keys = {};
    elapsedTime = 0, pausedTime = 0;
    lapElement.textContent = `1/${totalLaps}`;
    timeElement.textContent = "0.00";
    speedElement.textContent = "0";
    positionElement.textContent = "-";

    startScreen.style.display = 'none';
    trackSelectionScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
    hud.style.display = 'flex';
}

function startCountdown() {
    init();
    gameState = 'countdown';
    countdownScreen.style.display = 'flex';
    let count = 3;
    countdownText.textContent = count;
    const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) countdownText.textContent = count;
        else if (count === 0) countdownText.textContent = 'GO!';
        else {
            clearInterval(countdownInterval);
            countdownScreen.style.display = 'none';
            runGame();
        }
    }, 1000);
}

function runGame() {
    gameState = 'playing';
    startTime = Date.now();
    playSound(sounds.engine);
    gameLoop();
}

function update() {
    if (gameState !== 'playing') return;
    handleInput();
    updatePlayer();
    updateOpponents();
    updatePositions();
    updateLap();
    updateHUD();
    updateEngineSound();
}

function handleInput() {
    if (keys['ArrowUp']) {
        player.speed += player.acceleration;
    } else if (keys['ArrowDown']) {
        player.speed -= player.acceleration; // Now for reverse movement
    } else {
        // Apply friction to bring speed towards zero
        if (player.speed > 0) {
            player.speed = Math.max(0, player.speed - player.friction);
        } else if (player.speed < 0) {
            player.speed = Math.min(0, player.speed + player.friction);
        }
    }

    // Clamp speed between max reverse and max forward
    player.speed = Math.max(-player.maxSpeed / 2, Math.min(player.maxSpeed, player.speed));

    // Steering
    if (Math.abs(player.speed) > 0.1) { // Only allow turning when moving
        if (keys['ArrowLeft']) {
            player.angle -= player.turnSpeed;
        }
        if (keys['ArrowRight']) {
            player.angle += player.turnSpeed;
        }
    }
}

function updatePlayer() {
    const nextX = player.x + player.speed * Math.cos(player.angle);
    const nextY = player.y + player.speed * Math.sin(player.angle);

    if (isPositionValid(nextX, nextY, player)) {
        player.x = nextX;
        player.y = nextY;
    } else {
        // If next position is invalid, bounce the car
        player.speed *= -0.5; // Reverse and reduce speed
        playSound(sounds.collision);
    }
}

function isPositionValid(x, y, car) {
    const corners = getCarCorners({ ...car, x, y });
    for (const corner of corners) {
        if (corner.x < 0 || corner.x > canvas.width || corner.y < 0 || corner.y > canvas.height) return false;
        const pixelData = collisionCtx.getImageData(corner.x, corner.y, 1, 1).data;
        if (pixelData[0] === 0) return false;
    }
    return true;
}

function getCarCorners(car) {
    const corners = [];
    const halfW = car.width / 2, halfH = car.height / 2;
    const cosA = Math.cos(car.angle), sinA = Math.sin(car.angle);
    corners.push({ x: car.x + halfH * cosA - halfW * sinA, y: car.y + halfH * sinA + halfW * cosA });
    corners.push({ x: car.x + halfH * cosA + halfW * sinA, y: car.y + halfH * sinA - halfW * cosA });
    corners.push({ x: car.x - halfH * cosA - halfW * sinA, y: car.y - halfH * sinA + halfW * cosA });
    corners.push({ x: car.x - halfH * cosA + halfW * sinA, y: car.y - halfH * sinA - halfW * cosA });
    return corners;
}

function updateOpponents() {
    opponents.forEach(op => {
        const target = track.path[op.targetPoint];
        const dx = target.x - op.x, dy = target.y - op.y;
        const angleToTarget = Math.atan2(dy, dx);
        let angleDiff = angleToTarget - op.angle;
        while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
        while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
        op.angle += angleDiff * 0.2;
        op.x += op.speed * Math.cos(op.angle);
        op.y += op.speed * Math.sin(op.angle);
        if (Math.hypot(dx, dy) < 60) {
            op.targetPoint = (op.targetPoint + 1) % (track.path.length - 1);
        }
    });
}

function updatePositions() {
    const allRacers = [player, ...opponents];
    allRacers.forEach(racer => {
        const currentSegment = racer.checkpoint || 0;
        const nextSegment = (currentSegment + 1) % (track.path.length - 1);
        const segmentStart = track.path[currentSegment];
        const segmentEnd = track.path[nextSegment];
        const segmentLength = Math.hypot(segmentEnd.x - segmentStart.x, segmentEnd.y - segmentStart.y);
        const distToSegmentStart = Math.hypot(racer.x - segmentStart.x, racer.y - segmentStart.y);
        racer.distance = racer.lap * 10000 + currentSegment * 1000 + distToSegmentStart / segmentLength;
    });

    allRacers.sort((a, b) => b.distance - a.distance);
    const playerPosition = allRacers.indexOf(player) + 1;
    positionElement.textContent = `${playerPosition}/${allRacers.length}`;
}

function updateLap() {
    const nextCheckpointIndex = (player.checkpoint + 1) % (track.path.length - 1);
    const nextCheckpoint = track.path[nextCheckpointIndex];
    const distToNextCheckpoint = Math.hypot(player.x - nextCheckpoint.x, player.y - nextCheckpoint.y);

    if (distToNextCheckpoint < track.width) { // Use a larger radius for checkpoint detection
        player.checkpoint = nextCheckpointIndex;
        console.log(`Passed checkpoint: ${player.checkpoint}`);

        if (player.checkpoint === 0) { 
            player.lap++;
            console.log(`Lap ${player.lap} completed!`);

            if (player.lap >= totalLaps) {
                endGame();
            }
        }
    }
}

function updateHUD() {
    if (gameState === 'playing') {
        elapsedTime = (Date.now() - startTime - pausedTime) / 1000;
    }
    speedElement.textContent = Math.floor(player.speed * 10); // Display speed as integer
    timeElement.textContent = elapsedTime.toFixed(2);
    lapElement.textContent = `${Math.min(player.lap + 1, totalLaps)}/${totalLaps}`;
}

function endGame() {
    gameState = 'gameOver';
    sounds.engine.pause();
    cancelAnimationFrame(animationFrameId);
    finalTimeElement.textContent = elapsedTime.toFixed(2);
    gameOverScreen.style.display = 'flex';
    hud.style.display = 'none';
}

function pauseGame() {
    if (gameState !== 'playing') return;
    gameState = 'paused';
    pausedTime = Date.now() - startTime - elapsedTime * 1000;
    sounds.engine.pause();
    cancelAnimationFrame(animationFrameId);
    pauseScreen.style.display = 'flex';
}

function resumeGame() {
    if (gameState !== 'paused') return;
    gameState = 'playing';
    startTime = Date.now() - elapsedTime * 1000;
    playSound(sounds.engine);
    pauseScreen.style.display = 'none';
    gameLoop();
}

function showMainMenu() {
    cancelAnimationFrame(animationFrameId);
    gameState = 'start';
    startScreen.style.display = 'flex';
    trackSelectionScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    hud.style.display = 'none';
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (track) {
        drawTrack();
        drawObstacles();
        opponents.forEach(op => drawCar(op, ['#ff4136', '#ffd700', '#9370db'][opponents.indexOf(op)]));
        if(player) drawCar(player, '#00bfff');
    }
}

function drawTrack() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = track.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(track.path[0].x, track.path[0].y);
    for (let i = 1; i < track.path.length; i++) ctx.lineTo(track.path[i].x, track.path[i].y);
    ctx.stroke();
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
    const p1 = track.path[0], p2 = track.path[track.path.length - 2];
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI / 2;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(p1.x - track.width / 2 * Math.cos(angle), p1.y - track.width / 2 * Math.sin(angle));
    ctx.lineTo(p1.x + track.width / 2 * Math.cos(angle), p1.y + track.width / 2 * Math.sin(angle));
    ctx.stroke();
}

function drawTrackCollisionMap() {
    collisionCtx.fillStyle = 'black';
    collisionCtx.fillRect(0, 0, collisionCanvas.width, collisionCanvas.height);
    collisionCtx.strokeStyle = 'white';
    collisionCtx.lineWidth = track.width;
    collisionCtx.lineCap = 'round';
    collisionCtx.lineJoin = 'round';
    collisionCtx.beginPath();
    collisionCtx.moveTo(track.path[0].x, track.path[0].y);
    for (let i = 1; i < track.path.length; i++) collisionCtx.lineTo(track.path[i].x, track.path[i].y);
    collisionCtx.stroke();
}

function drawCar(car, color) {
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(-car.height / 2, -car.width / 2, car.height, car.width);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(-car.height / 4, -car.width / 2, car.height / 2, car.width);
    ctx.restore();
}

function drawObstacles() {
    obstacles.forEach(ob => {
        ctx.save();
        ctx.translate(ob.x, ob.y);
        if (ob.type === 'cone') {
            ctx.fillStyle = '#ff6347';
            ctx.beginPath();
            ctx.moveTo(0, -ob.height / 2);
            ctx.lineTo(-ob.width / 2, ob.height / 2);
            ctx.lineTo(ob.width / 2, ob.height / 2);
            ctx.closePath();
            ctx.fill();
        } else if (ob.type === 'barrier') {
            ctx.fillStyle = '#a9a9a9';
            ctx.fillRect(-ob.width / 2, -ob.height / 2, ob.width, ob.height);
        }
        ctx.restore();
    });
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => {});
}

function updateEngineSound() {
    sounds.engine.playbackRate = 1 + (Math.abs(player.speed) / player.maxSpeed);
}

function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Event Listeners
window.addEventListener('keydown', (e) => { keys[e.code] = true; });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

startButton.addEventListener('click', () => {
    playSound(sounds.click);
    startScreen.style.display = 'none';
    trackSelectionScreen.style.display = 'flex';
});

document.querySelectorAll('.track-option').forEach(option => {
    option.addEventListener('click', (e) => {
        playSound(sounds.click);
        selectedTrackId = parseInt(e.currentTarget.dataset.trackId);
        startCountdown();
    });
});

restartButton.addEventListener('click', () => { playSound(sounds.click); startCountdown(); });
newGameButton.addEventListener('click', () => { playSound(sounds.click); showMainMenu(); });
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);

showMainMenu();


