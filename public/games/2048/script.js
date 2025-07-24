document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const restartButton = document.getElementById('restart-button');
    const gameMessage = document.getElementById('game-message');
    const leaderboard = document.getElementById('leaderboard');
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    function init() {
        bestScoreDisplay.textContent = bestScore;
        updateLeaderboard();
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            gridContainer.appendChild(cell);
        }
        createGrid();
        addRandomTile();
        addRandomTile();
        drawGrid();
    }

    function createGrid() {
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    }

    function drawGrid() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.classList.add('tile');
                    tile.style.top = `${i * 115 + 15}px`;
                    tile.style.left = `${j * 115 + 15}px`;
                    tile.textContent = grid[i][j];
                    tile.style.backgroundColor = getTileColor(grid[i][j]);
                    tile.style.color = grid[i][j] > 4 ? '#f9f6f2' : '#776e65';
                    gridContainer.appendChild(tile);
                }
            }
        }
    }

    function addRandomTile() {
        let emptyTiles = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    emptyTiles.push({ x: i, y: j });
                }
            }
        }
        if (emptyTiles.length > 0) {
            const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function getTileColor(value) {
        const colors = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };
        return colors[value] || '#3c3a32';
    }

    function move(direction) {
        let moved = false;
        let tempGrid = JSON.parse(JSON.stringify(grid));

        if (direction === 'ArrowUp' || direction === 'ArrowDown') {
            for (let j = 0; j < gridSize; j++) {
                const column = grid.map(row => row[j]);
                const newColumn = transform(column, direction === 'ArrowUp');
                for (let i = 0; i < gridSize; i++) {
                    if (grid[i][j] !== newColumn[i]) {
                        moved = true;
                    }
                    grid[i][j] = newColumn[i];
                }
            }
        } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
            for (let i = 0; i < gridSize; i++) {
                const row = grid[i];
                const newRow = transform(row, direction === 'ArrowLeft');
                if (grid[i].join(',') !== newRow.join(',')) {
                    moved = true;
                }
                grid[i] = newRow;
            }
        }

        if (moved) {
            addRandomTile();
            drawGrid();
            updateScore();
            if (isGameOver()) {
                endGame('Game Over!');
            }
        }
    }

    function transform(line, moveTowardsStart) {
        let newLine = line.filter(cell => cell !== 0);
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        for (let i = 0; i < newLine.length - 1; i++) {
            if (newLine[i] === newLine[i + 1]) {
                newLine[i] *= 2;
                score += newLine[i];
                newLine.splice(i + 1, 1);
                if (newLine[i] === 2048) {
                    endGame('You Win!');
                }
            }
        }
        while (newLine.length < gridSize) {
            newLine.push(0);
        }
        if (!moveTowardsStart) {
            newLine.reverse();
        }
        return newLine;
    }

    function updateScore() {
        scoreDisplay.textContent = score;
        if (score > bestScore) {
            bestScore = score;
            bestScoreDisplay.textContent = bestScore;
            localStorage.setItem('bestScore', bestScore);
        }
    }

    function isGameOver() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === 0) {
                    return false;
                }
                if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) {
                    return false;
                }
                if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) {
                    return false;
                }
            }
        }
        return true;
    }

    function endGame(message) {
        gameMessage.style.display = 'flex';
        gameMessage.querySelector('p').textContent = message;
        leaderboardData.push({ score: score, date: new Date().toLocaleString() });
        leaderboardData.sort((a, b) => b.score - a.score);
        leaderboardData = leaderboardData.slice(0, 10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
        updateLeaderboard();
    }

    function updateLeaderboard() {
        leaderboard.innerHTML = '';
        leaderboardData.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.score} - ${entry.date}`;
            leaderboard.appendChild(li);
        });
    }

    function restartGame() {
        score = 0;
        updateScore();
        createGrid();
        addRandomTile();
        addRandomTile();
        drawGrid();
        gameMessage.style.display = 'none';
    }

    restartButton.addEventListener('click', restartGame);
    gameMessage.querySelector('.retry-button').addEventListener('click', restartGame);

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            move(e.key);
        }
    });

    init();
});