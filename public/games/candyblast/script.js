document.addEventListener('DOMContentLoaded', () => {
    // HTML Elements
    const titleScreen = document.getElementById('title-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const gameContainer = document.querySelector('.game-container');
    const leaderboardContainer = document.querySelector('.leaderboard-container');
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const movesLeftElement = document.getElementById('moves-left');
    const difficultySelect = document.getElementById('difficulty');
    const leaderboardList = document.getElementById('leaderboard-list');
    const gameBoard = document.querySelector('.game-board');
    const muteBtn = document.getElementById('mute-btn');
    const restartButton = document.getElementById('restart-button');
    const blastSound = document.getElementById('blast-sound');
    const backgroundMusic = document.getElementById('background-music');

    // Game Constants
    const gridSize = 8;
    const candyColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const levelGoals = [1000, 2500, 4500, 7000, 10000, 13500, 17500, 22000, 27000, 32500];
    const levelMoves = [30, 30, 25, 25, 20, 20, 15, 15, 10, 10];

    // Game State
    let board = [];
    let score = 0;
    let level = 1;
    let movesLeft = 0;
    let selectedCandy = null;
    let isMuted = false;
    let isAnimating = false;

    const difficultySettings = {
        easy: { scoreMultiplier: 1 },
        medium: { scoreMultiplier: 1.5 },
        hard: { scoreMultiplier: 2 },
    };

    // --- Game Initialization ---
    function startGame() {
        score = 0;
        level = 1;
        setupLevel();
        createBoard();
        renderBoard();
        updateLeaderboard();
    }

    function setupLevel() {
        movesLeft = levelMoves[level - 1];
        scoreElement.textContent = score;
        levelElement.textContent = level;
        movesLeftElement.textContent = movesLeft;
    }

    // --- Board Creation & Rendering ---
    function createBoard() {
        board = [];
        for (let i = 0; i < gridSize; i++) {
            board[i] = [];
            for (let j = 0; j < gridSize; j++) {
                board[i][j] = createCandy(i, j);
            }
        }
        // Ensure no matches at start
        let matches = findMatches();
        while (matches.length > 0) {
            matches.forEach(match => {
                match.forEach(pos => {
                    board[pos.row][pos.col] = createCandy(pos.row, pos.col);
                });
            });
            matches = findMatches();
        }
    }

    function createCandy(row, col) {
        return {
            color: candyColors[Math.floor(Math.random() * candyColors.length)],
            type: 'normal',
            row,
            col
        };
    }

    function renderBoard() {
        gameBoard.innerHTML = '';
        board.forEach(row => {
            row.forEach(candy => {
                if (candy) {
                    const candyElement = document.createElement('div');
                    candyElement.classList.add('candy', candy.color);
                    if (candy.type.startsWith('striped')) {
                        candyElement.classList.add(candy.type);
                    }
                    if (candy.type === 'color-bomb') {
                        candyElement.classList.add('color-bomb');
                    }
                    candyElement.dataset.row = candy.row;
                    candyElement.dataset.col = candy.col;
                    candyElement.addEventListener('click', handleCandyClick);
                    gameBoard.appendChild(candyElement);
                }
            });
        });
    }

    // --- Event Handlers ---
    function handleCandyClick(event) {
        if (isAnimating) return;
        const clickedCandyElement = event.target;
        const row = parseInt(clickedCandyElement.dataset.row);
        const col = parseInt(clickedCandyElement.dataset.col);

        if (selectedCandy) {
            const candy1 = selectedCandy;
            const candy2 = board[row][col];
            if (isAdjacent(candy1, candy2)) {
                swapCandies(candy1, candy2);
            } 
            selectedCandy = null;
        } else {
            selectedCandy = board[row][col];
        }
    }

    // --- Game Logic ---
    function swapCandies(candy1, candy2) {
        isAnimating = true;
        movesLeft--;
        movesLeftElement.textContent = movesLeft;

        // Animate swap
        const candy1Elem = document.querySelector(`[data-row='${candy1.row}'][data-col='${candy1.col}']`);
        const candy2Elem = document.querySelector(`[data-row='${candy2.row}'][data-col='${candy2.col}']`);
        
        const tempTop = candy1Elem.style.top;
        const tempLeft = candy1Elem.style.left;
        candy1Elem.style.top = candy2Elem.style.top;
        candy1Elem.style.left = candy2Elem.style.left;
        candy2Elem.style.top = tempTop;
        candy2Elem.style.left = tempLeft;

        // Swap in the board data
        [board[candy1.row][candy1.col], board[candy2.row][candy2.col]] = [board[candy2.row][candy2.col], board[candy1.row][candy1.col]];
        [candy1.row, candy1.col, candy2.row, candy2.col] = [candy2.row, candy2.col, candy1.row, candy1.col];

        setTimeout(async () => {
            renderBoard();
            await processMatches();
            isAnimating = false;
            checkGameOver();
        }, 300);
    }

    async function processMatches() {
        let matches = findMatches();
        if (matches.length === 0) return;

        while (matches.length > 0) {
            await blastCandies(matches);
            await refillBoard();
            matches = findMatches();
        }
    }

    function findMatches() {
        const matches = [];
        // Horizontal
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize - 2; j++) {
                let candy1 = board[i][j];
                let candy2 = board[i][j+1];
                let candy3 = board[i][j+2];
                if (candy1 && candy2 && candy3 && candy1.color === candy2.color && candy2.color === candy3.color) {
                    const match = [{row: i, col: j}, {row: i, col: j+1}, {row: i, col: j+2}];
                    j += 2;
                    // Check for longer matches
                    while (j + 1 < gridSize && board[i][j+1] && board[i][j+1].color === candy1.color) {
                        j++;
                        match.push({row: i, col: j});
                    }
                    matches.push(match);
                }
            }
        }
        // Vertical
        for (let j = 0; j < gridSize; j++) {
            for (let i = 0; i < gridSize - 2; i++) {
                let candy1 = board[i][j];
                let candy2 = board[i+1][j];
                let candy3 = board[i+2][j];
                if (candy1 && candy2 && candy3 && candy1.color === candy2.color && candy2.color === candy3.color) {
                    const match = [{row: i, col: j}, {row: i+1, col: j}, {row: i+2, col: j}];
                    i += 2;
                    while (i + 1 < gridSize && board[i+1][j] && board[i+1][j].color === candy1.color) {
                        i++;
                        match.push({row: i, col: j});
                    }
                    matches.push(match);
                }
            }
        }
        return matches;
    }

    async function blastCandies(matches) {
        isAnimating = true;
        let scoreGained = 0;
        let specialCandiesToCreate = [];

        for (const match of matches) {
            scoreGained += match.length;
            if (match.length === 4) {
                specialCandiesToCreate.push({pos: match[1], type: 'striped'});
            } else if (match.length >= 5) {
                specialCandiesToCreate.push({pos: match[2], type: 'color-bomb'});
            }

            for (const pos of match) {
                const candy = board[pos.row][pos.col];
                if (!candy) continue;

                const candyElem = document.querySelector(`[data-row='${pos.row}'][data-col='${pos.col}']`);
                if (candyElem) {
                    candyElem.classList.add('blast');
                }
                board[pos.row][pos.col] = null;
            }
        }
        
        updateScore(scoreGained);
        if (!isMuted) blastSound.play();
        if (matches.flat().length > 4) {
            gameBoard.classList.add('shake');
            setTimeout(() => gameBoard.classList.remove('shake'), 500);
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        specialCandiesToCreate.forEach(special => {
            const {pos, type} = special;
            if (type === 'striped') {
                board[pos.row][pos.col] = {...createCandy(pos.row, pos.col), type: Math.random() > 0.5 ? 'striped-h' : 'striped-v'};
            } else {
                board[pos.row][pos.col] = {...createCandy(pos.row, pos.col), type: 'color-bomb', color: 'black'};
            }
        });

        renderBoard();
    }

    async function refillBoard() {
        for (let j = 0; j < gridSize; j++) {
            let emptyCells = 0;
            for (let i = gridSize - 1; i >= 0; i--) {
                if (board[i][j] === null) {
                    emptyCells++;
                } else if (emptyCells > 0) {
                    board[i + emptyCells][j] = board[i][j];
                    board[i + emptyCells][j].row = i + emptyCells;
                    board[i][j] = null;
                }
            }
            for (let i = 0; i < emptyCells; i++) {
                board[i][j] = createCandy(i, j);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 300));
        renderBoard();
        isAnimating = false;
    }

    function updateScore(points) {
        const multiplier = difficultySettings[difficultySelect.value].scoreMultiplier;
        score += points * multiplier;
        scoreElement.textContent = Math.floor(score);

        if (level <= levelGoals.length && score >= levelGoals[level - 1]) {
            level++;
            if (level > levelGoals.length) {
                endGame(true); // Win
                return;
            }
            alert(`Level Up! You are now on level ${level}`);
            setupLevel();
        }
    }

    function checkGameOver() {
        if (movesLeft <= 0 && score < levelGoals[level - 1]) {
            endGame(false); // Lose
        }
    }

    function endGame(isWin) {
        if (isWin) {
            alert('You Win! Game Over!');
            const name = prompt('Enter your name for the leaderboard:');
            if (name) saveScore(name, score);
        } else {
            alert('Game Over! You ran out of moves.');
        }
        titleScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        leaderboardContainer.style.display = 'none';
    }

    function isAdjacent(candy1, candy2) {
        const rowDiff = Math.abs(candy1.row - candy2.row);
        const colDiff = Math.abs(candy1.col - candy2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    // --- Leaderboard ---
    function updateLeaderboard() {
        leaderboardList.innerHTML = '';
        const leaderboard = getLeaderboard();
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name}: ${Math.floor(entry.score)}`;
            leaderboardList.appendChild(li);
        });
    }

    function saveScore(name, score) {
        const leaderboard = getLeaderboard();
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard.slice(0, 10)));
        updateLeaderboard();
    }

    function getLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard')) || [];
    }

    // --- UI Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        titleScreen.style.display = 'none';
        gameContainer.style.display = 'flex';
        leaderboardContainer.style.display = 'block';
        if (!isMuted) backgroundMusic.play().catch(e => console.log("Audio play failed"));
        startGame();
    });

    restartButton.addEventListener('click', startGame);

    muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        backgroundMusic.muted = isMuted;
        blastSound.muted = isMuted;
        muteBtn.textContent = isMuted ? 'Unmute' : 'Mute';
    });

    // Initial setup
    updateLeaderboard();
});