const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const startGameButton = document.getElementById('start-game-button');
const endScreen = document.getElementById('end-screen');
const playAgainButton = document.getElementById('play-again-button');
const finalScoreDisplay = document.getElementById('final-score');

let score = 0;
let currentLevel = 1;
let highScores = []; // Store high scores in memory instead of localStorage

function updateScore() {
    if (document.getElementById('score')) {
        document.getElementById('score').textContent = `Score: ${score}`;
    }
    if (document.getElementById('level')) {
        document.getElementById('level').textContent = `Level: ${currentLevel}`;
    }
}

function showScreen(screenElement) {
    if (screenElement) {
        screenElement.classList.add('active');
        screenElement.classList.remove('fade-out');
    }
}

function hideScreen(screenElement) {
    if (screenElement) {
        screenElement.classList.add('fade-out');
        screenElement.addEventListener('transitionend', () => {
            screenElement.classList.remove('active');
            screenElement.classList.remove('fade-out');
        }, { once: true });
    }
}

function saveHighScore(score, level) {
    highScores.push({ score, level, date: new Date().toISOString() });
    // Keep only top 10 scores
    highScores.sort((a, b) => b.score - a.score);
    if (highScores.length > 10) {
        highScores = highScores.slice(0, 10);
    }
}

let animationFrameId = null;

function gameOver() {
    const endSound = document.getElementById('end-sound');
    if (endSound) endSound.play().catch(() => {});
    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = `Your Score: ${score}`;
    }
    saveHighScore(score, currentLevel);
    showScreen(endScreen);
    if (canvas) canvas.style.display = 'none';
    score = 0;
    currentLevel = 1;
    updateScore();
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

const bubbleRadius = 30;
const bubbleImagePaths = [
    'images/f1.jpg',
    'images/f2.jpg',
    'images/f3.jpg',
    'images/f4.jpg',
    'images/f5.jpg',
];
let bubbleImages = [];

// Preload images
function preloadImages(callback) {
    let loadedCount = 0;
    const totalImages = bubbleImagePaths.length;

    if (totalImages === 0) {
        callback();
        return;
    }

    bubbleImagePaths.forEach((path, index) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            bubbleImages[index] = img;
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${path}`);
            // Create a fallback colored circle as an image
            const fallbackCanvas = document.createElement('canvas');
            fallbackCanvas.width = bubbleRadius * 2;
            fallbackCanvas.height = bubbleRadius * 2;
            const fallbackCtx = fallbackCanvas.getContext('2d');
            
            // Create different colored circles for each failed image
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
            fallbackCtx.fillStyle = colors[index % colors.length];
            fallbackCtx.beginPath();
            fallbackCtx.arc(bubbleRadius, bubbleRadius, bubbleRadius - 2, 0, Math.PI * 2);
            fallbackCtx.fill();
            fallbackCtx.strokeStyle = '#fff';
            fallbackCtx.lineWidth = 2;
            fallbackCtx.stroke();
            
            // Convert canvas to image
            const fallbackImg = new Image();
            fallbackImg.src = fallbackCanvas.toDataURL();
            bubbleImages[index] = fallbackImg;
            
            loadedCount++;
            if (loadedCount === totalImages) {
                callback();
            }
        };
    });
}

const gridRows = 12;
const gridCols = 20;
const rowHeight = bubbleRadius * 1.7;
const colWidth = bubbleRadius * 2;

let grid = [];
let shooterBubble;

function initGame() {
    const startSound = document.getElementById('start-sound');
    if (startSound) startSound.play().catch(() => {});

    preloadImages(() => {
        // Create the grid of bubbles
        grid = [];
        const initialRows = Math.min(gridRows / 2, 3 + currentLevel - 1);
        
        for (let row = 0; row < gridRows; row++) {
            grid[row] = [];
            for (let col = 0; col < gridCols; col++) {
                if (row < initialRows) {
                    const x = col * colWidth + bubbleRadius + (row % 2 === 1 ? bubbleRadius : 0);
                    const y = row * rowHeight + bubbleRadius;
                    const imageIndex = Math.floor(Math.random() * bubbleImagePaths.length);
                    grid[row][col] = { 
                        x, y, 
                        image: bubbleImages[imageIndex], 
                        imagePath: bubbleImagePaths[imageIndex], 
                        popped: false, 
                        row: row, 
                        col: col 
                    };
                } else {
                    grid[row][col] = null;
                }
            }
        }

        resetShooter();
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        gameLoop();
        updateScore();
    });
}

function resetShooter() {
    const imageIndex = Math.floor(Math.random() * bubbleImagePaths.length);
    shooterBubble = {
        x: canvas.width / 2,
        y: canvas.height - bubbleRadius,
        image: bubbleImages[imageIndex],
        imagePath: bubbleImagePaths[imageIndex],
        isShot: false,
        speedX: 0,
        speedY: 0
    };
}

function gameLoop() {
    update();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
}

function update() {
    if (!shooterBubble.isShot) {
        return;
    }

    shooterBubble.x += shooterBubble.speedX;
    shooterBubble.y += shooterBubble.speedY;

    // Wall collision
    if (shooterBubble.x - bubbleRadius < 0 || shooterBubble.x + bubbleRadius > canvas.width) {
        shooterBubble.speedX *= -1;
    }

    // Top collision
    if (shooterBubble.y - bubbleRadius < 0) {
        snapBubbleToGrid();
        return;
    }

    // Bubble collision
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const bubble = grid[row][col];
            if (bubble !== null) {
                const dx = shooterBubble.x - bubble.x;
                const dy = shooterBubble.y - bubble.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < bubbleRadius * 2) {
                    snapBubbleToGrid();
                    return;
                }
            }
        }
    }
}

function draw() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid bubbles
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const bubble = grid[row][col];
            if (bubble !== null && bubble.image) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(bubble.x, bubble.y, bubbleRadius, 0, Math.PI * 2);
                ctx.clip();
                ctx.drawImage(bubble.image, bubble.x - bubbleRadius, bubble.y - bubbleRadius, bubbleRadius * 2, bubbleRadius * 2);
                ctx.restore();
            }
        }
    }

    // Draw shooter bubble
    if (shooterBubble && shooterBubble.image) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(shooterBubble.x, shooterBubble.y, bubbleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(shooterBubble.image, shooterBubble.x - bubbleRadius, shooterBubble.y - bubbleRadius, bubbleRadius * 2, bubbleRadius * 2);
        ctx.restore();
    }
}

function snapBubbleToGrid() {
    shooterBubble.isShot = false;

    // Find the closest empty grid cell
    let closestRow = -1;
    let closestCol = -1;
    let minDistance = Infinity;

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (grid[row][col] === null) {
                const gridX = col * colWidth + bubbleRadius + (row % 2 === 1 ? bubbleRadius : 0);
                const gridY = row * rowHeight + bubbleRadius;
                const dx = shooterBubble.x - gridX;
                const dy = shooterBubble.y - gridY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestRow = row;
                    closestCol = col;
                }
            }
        }
    }

    if (closestRow !== -1 && closestCol !== -1) {
        const gridX = closestCol * colWidth + bubbleRadius + (closestRow % 2 === 1 ? bubbleRadius : 0);
        const gridY = closestRow * rowHeight + bubbleRadius;
        
        grid[closestRow][closestCol] = {
            x: gridX,
            y: gridY,
            image: shooterBubble.image,
            imagePath: shooterBubble.imagePath,
            popped: false,
            row: closestRow,
            col: closestCol
        };

        if (closestRow >= gridRows - 1) {
            gameOver();
        } else {
            checkMatches(closestRow, closestCol);
        }
    }

    resetShooter();
}

function getNeighbors(row, col) {
    const neighbors = [];
    if (!grid[row] || !grid[row][col]) return neighbors;

    // Define neighbor positions based on even/odd row for hexagonal grid
    const isEvenRow = row % 2 === 0;
    const positions = [
        [-1, isEvenRow ? -1 : 0], // Top left
        [-1, isEvenRow ? 0 : 1],  // Top right
        [0, -1],                  // Left
        [0, 1],                   // Right
        [1, isEvenRow ? -1 : 0],  // Bottom left
        [1, isEvenRow ? 0 : 1]    // Bottom right
    ];

    for (const [dy, dx] of positions) {
        const newRow = row + dy;
        const newCol = col + dx;

        if (newRow >= 0 && newRow < gridRows && 
            newCol >= 0 && newCol < gridCols && 
            grid[newRow][newCol] !== null) {
            neighbors.push(grid[newRow][newCol]);
        }
    }
    return neighbors;
}

function checkMatches(startRow, startCol) {
    const startBubble = grid[startRow][startCol];
    if (!startBubble) return;

    const toCheck = [startBubble];
    const matched = [];
    const visited = new Set();

    const getKey = (bubble) => `${bubble.row},${bubble.col}`;

    matched.push(startBubble);
    visited.add(getKey(startBubble));

    while (toCheck.length > 0) {
        const current = toCheck.pop();
        const neighbors = getNeighbors(current.row, current.col);

        for (const neighbor of neighbors) {
            const key = getKey(neighbor);
            if (!visited.has(key) && neighbor.imagePath === startBubble.imagePath) {
                visited.add(key);
                matched.push(neighbor);
                toCheck.push(neighbor);
            }
        }
    }

    if (matched.length >= 3) {
        const popSound = document.getElementById('pop-sound');
        if (popSound) popSound.play().catch(() => {});

        // Remove matched bubbles
        matched.forEach(bubble => {
            grid[bubble.row][bubble.col] = null;
        });

        // Update score
        score += matched.length * 10;
        updateScore();

        // Handle floating bubbles
        setTimeout(() => {
            dropFloatingBubbles();
            if (checkLevelCompletion()) {
                levelUp();
            }
        }, 100);
    }
}

function checkLevelCompletion() {
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (grid[row][col] !== null) {
                return false;
            }
        }
    }
    return true;
}

function levelUp() {
    currentLevel++;
    score += 100; // Bonus for completing level
    updateScore();
    setTimeout(() => {
        alert(`Level Up! You are now on Level ${currentLevel}`);
        initGame();
    }, 500);
}

function getConnectedBubbles() {
    const connected = new Set();
    const visited = new Set();
    const queue = [];

    // Add bubbles from the top row that are not null
    for (let col = 0; col < gridCols; col++) {
        if (grid[0][col] !== null) {
            queue.push(grid[0][col]);
            visited.add(`${0},${col}`);
        }
    }

    while (queue.length > 0) {
        const current = queue.shift();
        connected.add(`${current.row},${current.col}`);

        const neighbors = getNeighbors(current.row, current.col);
        for (const neighbor of neighbors) {
            const key = `${neighbor.row},${neighbor.col}`;
            if (!visited.has(key)) {
                visited.add(key);
                queue.push(neighbor);
            }
        }
    }
    return connected;
}

function dropFloatingBubbles() {
    const connectedBubbles = getConnectedBubbles();
    let bubblesDropped = 0;

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            const bubble = grid[row][col];
            if (bubble !== null && !connectedBubbles.has(`${row},${col}`)) {
                grid[row][col] = null;
                bubblesDropped++;
                score += 5; // Bonus for dropped bubbles
            }
        }
    }

    if (bubblesDropped > 0) {
        updateScore();
    }
}

// Canvas click event listener
if (canvas) {
    canvas.addEventListener('click', (event) => {
        if (!shooterBubble || shooterBubble.isShot) {
            return;
        }

        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic && backgroundMusic.paused) {
            backgroundMusic.play().catch(() => {});
        }

        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const angle = Math.atan2(mouseY - shooterBubble.y, mouseX - shooterBubble.x);
        const speed = 10;
        shooterBubble.speedX = Math.cos(angle) * speed;
        shooterBubble.speedY = Math.sin(angle) * speed;
        shooterBubble.isShot = true;
    });
}

// Mute button functionality
const muteButton = document.getElementById('mute-button');
const backgroundMusic = document.getElementById('background-music');

if (muteButton && backgroundMusic) {
    muteButton.addEventListener('click', () => {
        backgroundMusic.muted = !backgroundMusic.muted;
        muteButton.textContent = backgroundMusic.muted ? 'Unmute' : 'Mute';
    });
}

// Leaderboard button (optional)
const leaderboardButton = document.getElementById('leaderboard-button');
if (leaderboardButton) {
    leaderboardButton.addEventListener('click', () => {
        // Display high scores in alert (since we can't navigate to another page)
        let leaderboardText = 'High Scores:\n';
        highScores.slice(0, 5).forEach((entry, index) => {
            leaderboardText += `${index + 1}. Score: ${entry.score}, Level: ${entry.level}\n`;
        });
        if (highScores.length === 0) {
            leaderboardText += 'No scores yet!';
        }
        alert(leaderboardText);
    });
}

// Initial setup
if (startScreen && canvas) {
    showScreen(startScreen);
    canvas.style.display = 'none';
}

if (startGameButton) {
    startGameButton.addEventListener('click', () => {
        hideScreen(startScreen);
        if (canvas) canvas.style.display = 'block';
        initGame();
    });
}

if (playAgainButton) {
    playAgainButton.addEventListener('click', () => {
        hideScreen(endScreen);
        if (canvas) canvas.style.display = 'block';
        initGame();
    });
}