const symbols = ['🍎', '🍍', '☮️', '🍌', '🥭', '🍊', '🍇', '🍓', '🍎', '🍍', '☮️', '🍌', '🥭', '🍊', '🍇', '🍓'];
let shuffledSymbols = [];
let flippedCards = [];
let matchedCards = [];
let turns = 0;

const gameBoard = document.getElementById('game-board');
const turnsSpan = document.getElementById('turns');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function initializeGame() {
    shuffledSymbols = shuffle([...symbols]);
    gameBoard.innerHTML = '';
    turns = 0;
    turnsSpan.textContent = turns;
    flippedCards = [];
    matchedCards = [];

    shuffledSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-face card-back"></div>
                <div class="card-face card-front">${symbol}</div>
            </div>
        `;
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
}

function handleCardClick(event) {
    const clickedCard = event.currentTarget;

    if (flippedCards.length < 2 && !clickedCard.classList.contains('flipped') && !matchedCards.includes(clickedCard)) {
        clickedCard.classList.add('flipped');
        flippedCards.push(clickedCard);

        if (flippedCards.length === 2) {
            turns++;
            turnsSpan.textContent = turns;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-front').textContent;
    const symbol2 = card2.querySelector('.card-front').textContent;

    if (symbol1 === symbol2) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        if (matchedCards.length === symbols.length) {
            setTimeout(() => alert(`Congratulations! You finished in ${turns} turns!`), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

initializeGame();
