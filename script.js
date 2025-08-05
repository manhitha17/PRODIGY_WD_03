const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const pvpBtn = document.getElementById('pvp');
const aiBtn = document.getElementById('ai');

let cells = [];
let currentPlayer = 'X';
let gameActive = false;
let vsAI = false;

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function initBoard() {
  board.innerHTML = '';
  cells = Array(9).fill('');
  gameActive = true;
  currentPlayer = 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || cells[index] !== '') return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    status.textContent = `Player ${currentPlayer} wins!`;
    highlightWin();
    gameActive = false;
  } else if (cells.every(cell => cell !== '')) {
    status.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;

    if (vsAI && currentPlayer === 'O') {
      setTimeout(aiMove, 500);
    }
  }
}

function aiMove() {
  let emptyCells = cells.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
  let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const cell = document.querySelector(`[data-index='${randomIndex}']`);
  handleClick({target: cell});
}

function checkWin() {
  return winningCombinations.some(comb => {
    const [a, b, c] = comb;
    return cells[a] && cells[a] === cells[b] && cells[a] === cells[c];
  });
}

function highlightWin() {
  winningCombinations.forEach(comb => {
    const [a, b, c] = comb;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      document.querySelector(`[data-index='${a}']`).classList.add('winner');
      document.querySelector(`[data-index='${b}']`).classList.add('winner');
      document.querySelector(`[data-index='${c}']`).classList.add('winner');
    }
  });
}

restartBtn.addEventListener('click', initBoard);
pvpBtn.addEventListener('click', () => {
  vsAI = false;
  initBoard();
});
aiBtn.addEventListener('click', () => {
  vsAI = true;
  initBoard();
});
