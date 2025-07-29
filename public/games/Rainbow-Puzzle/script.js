// Get DOM elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

// Game constants
const grid_size = 8;
const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

// Game state variables
let board = [];
let selectedTile = null;
let score = 0;

// Initializes the game board with tiles
function create_board() {
    for (let i = 0; i < grid_size; i++) {
        board[i] = [];
        for (let j = 0; j < grid_size; j++) {
            const tile = create_tile(i, j);
            gameBoard.appendChild(tile);
            board[i][j] = tile;
        }
    }
}

// Creates a single tile element
function create_tile(row, col) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.style.backgroundColor = get_random_color();
    tile.addEventListener('click', () => on_tile_click(tile));
    return tile;
}

// Returns a random color from the colors array
function get_random_color() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Handles the click event on a tile
function on_tile_click(tile) {
    if (selectedTile) {
        // If a tile is already selected, check for adjacency and swap
        if (is_adjacent(selectedTile, tile)) {
            swap_tiles(selectedTile, tile);
            // Check for matches after the swap
            if (!check_and_remove_matches()) {
                // If no match, swap back after a short delay
                setTimeout(() => {
                    swap_tiles(selectedTile, tile); // Swap back if no match
                }, 300);
            }
            selectedTile.classList.remove('selected');
            selectedTile = null;
        } else {
            // If not adjacent, deselect the old tile and select the new one
            selectedTile.classList.remove('selected');
            selectedTile = tile;
            selectedTile.classList.add('selected');
        }
    } else {
        // If no tile is selected, select the clicked tile
        selectedTile = tile;
        selectedTile.classList.add('selected');
    }
}

// Checks if two tiles are adjacent (not diagonally)
function is_adjacent(tile1, tile2) {
    const row1 = parseInt(tile1.dataset.row);
    const col1 = parseInt(tile1.dataset.col);
    const row2 = parseInt(tile2.dataset.row);
    const col2 = parseInt(tile2.dataset.col);

    return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
}

// Swaps the background color of two tiles
function swap_tiles(tile1, tile2) {
    const tempColor = tile1.style.backgroundColor;
    tile1.style.backgroundColor = tile2.style.backgroundColor;
    tile2.style.backgroundColor = tempColor;
}

// Checks for and removes matched tiles
function check_and_remove_matches() {
    let matched_tiles = new Set();

    // Check for horizontal matches (3 or more tiles)
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size - 2; j++) {
            let tile1 = board[i][j];
            let tile2 = board[i][j + 1];
            let tile3 = board[i][j + 2];
            if (tile1.style.backgroundColor && tile1.style.backgroundColor === tile2.style.backgroundColor && tile2.style.backgroundColor === tile3.style.backgroundColor) {
                matched_tiles.add(tile1);
                matched_tiles.add(tile2);
                matched_tiles.add(tile3);
            }
        }
    }

    // Check for vertical matches (3 or more tiles)
    for (let j = 0; j < grid_size; j++) {
        for (let i = 0; i < grid_size - 2; i++) {
            let tile1 = board[i][j];
            let tile2 = board[i + 1][j];
            let tile3 = board[i + 2][j];
            if (tile1.style.backgroundColor && tile1.style.backgroundColor === tile2.style.backgroundColor && tile2.style.backgroundColor === tile3.style.backgroundColor) {
                matched_tiles.add(tile1);
                matched_tiles.add(tile2);
                matched_tiles.add(tile3);
            }
        }
    }

    if (matched_tiles.size > 0) {
        remove_tiles(matched_tiles);
        return true;
    }
    return false;
}

// Removes matched tiles from the board
function remove_tiles(tiles) {
    tiles.forEach(tile => {
        tile.style.backgroundColor = '';
        score += 10;
    });
    update_score();
    // Refill the board after a delay
    setTimeout(refill_board, 500);
}

// Refills the board with new tiles
function refill_board() {
    // Drop existing tiles down
    for (let j = 0; j < grid_size; j++) {
        let empty_row_index = grid_size - 1;
        for (let i = grid_size - 1; i >= 0; i--) {
            if (board[i][j].style.backgroundColor !== '') {
                if (empty_row_index !== i) {
                    board[empty_row_index][j].style.backgroundColor = board[i][j].style.backgroundColor;
                    board[i][j].style.backgroundColor = '';
                }
                empty_row_index--;
            }
        }
    }

    // Fill the empty spaces with new tiles
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (board[i][j].style.backgroundColor === '') {
                board[i][j].style.backgroundColor = get_random_color();
            }
        }
    }

    // Check for new matches after refilling (cascades)
    if (check_and_remove_matches()) {
        // A cascade is happening, so the refill process will be triggered again
    } else {
        // If no more matches, check for possible moves
        if (!check_possible_moves()) {
            end_game();
        }
    }
}

// Updates the score display
function update_score() {
    scoreElement.textContent = score;
}

// Checks if there are any possible moves left on the board
function check_possible_moves() {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size; j++) {
            // Test horizontal swap
            if (j < grid_size - 1) {
                swap_colors(i, j, i, j + 1);
                if (has_match_after_swap()) {
                    swap_colors(i, j, i, j + 1); // Swap back
                    return true;
                }
                swap_colors(i, j, i, j + 1); // Swap back
            }
            // Test vertical swap
            if (i < grid_size - 1) {
                swap_colors(i, j, i + 1, j);
                if (has_match_after_swap()) {
                    swap_colors(i, j, i + 1, j); // Swap back
                    return true;
                }
                swap_colors(i, j, i + 1, j); // Swap back
            }
        }
    }
    return false;
}

// Swaps the colors of two tiles in the board data structure (for checking possible moves)
function swap_colors(r1, c1, r2, c2) {
    const tempColor = board[r1][c1].style.backgroundColor;
    board[r1][c1].style.backgroundColor = board[r2][c2].style.backgroundColor;
    board[r2][c2].style.backgroundColor = tempColor;
}

// Checks if a match exists after a swap (used for checking possible moves)
function has_match_after_swap() {
    for (let i = 0; i < grid_size; i++) {
        for (let j = 0; j < grid_size - 2; j++) {
            if (board[i][j].style.backgroundColor && board[i][j].style.backgroundColor === board[i][j+1].style.backgroundColor && board[i][j].style.backgroundColor === board[i][j+2].style.backgroundColor) {
                return true;
            }
        }
    }
    for (let i = 0; i < grid_size - 2; i++) {
        for (let j = 0; j < grid_size; j++) {
            if (board[i][j].style.backgroundColor && board[i][j].style.backgroundColor === board[i+1][j].style.backgroundColor && board[i][j].style.backgroundColor === board[i+2][j].style.backgroundColor) {
                return true;
            }
        }
    }
    return false;
}

// Ends the game and displays the game over screen
function end_game() {
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Restarts the game when the restart button is clicked
restartButton.addEventListener('click', () => {
    board = [];
    gameBoard.innerHTML = '';
    score = 0;
    update_score();
    gameOverElement.style.display = 'none';
    create_board();
});

// Initial setup
create_board();