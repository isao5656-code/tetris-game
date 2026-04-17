const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const COLORS = {
  I: '#2ec5ff',
  O: '#ffd44d',
  T: '#af7cff',
  S: '#54df72',
  Z: '#ff6161',
  J: '#6186ff',
  L: '#ff9e48'
};

const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ]
};

const SCORE_TABLE = [0, 100, 300, 500, 800];

const boardCanvas = document.getElementById('board');
const boardCtx = boardCanvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');

const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');

const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlaySub = document.getElementById('overlay-sub');

let board = [];
let current = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let dropMs = 1000;
let dropAcc = 0;
let lastTime = 0;
let paused = false;
let gameOver = false;

function initBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const keys = Object.keys(SHAPES);
  const type = keys[Math.floor(Math.random() * keys.length)];
  const matrix = SHAPES[type].map((row) => [...row]);
  return {
    type,
    matrix,
    x: Math.floor((COLS - matrix[0].length) / 2),
    y: -1
  };
}

function rotateMatrix(matrix) {
  const n = matrix.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));
  for (let y = 0; y < n; y += 1) {
    for (let x = 0; x < n; x += 1) {
      rotated[x][n - 1 - y] = matrix[y][x];
    }
  }
  return rotated;
}

function collides(piece, offX = 0, offY = 0, matrix = piece.matrix) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (!matrix[y][x]) continue;
      const nx = piece.x + x + offX;
      const ny = piece.y + y + offY;

      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function merge(piece) {
  for (let y = 0; y < piece.matrix.length; y += 1) {
    for (let x = 0; x < piece.matrix[y].length; x += 1) {
      if (!piece.matrix[y][x]) continue;
      const by = piece.y + y;
      const bx = piece.x + x;
      if (by >= 0) board[by][bx] = piece.type;
    }
  }
}

function clearLines() {
  let cleared = 0;
  for (let y = ROWS - 1; y >= 0; y -= 1) {
    if (board[y].every((cell) => cell !== null)) {
      board.splice(y, 1);
      board.unshift(Array(COLS).fill(null));
      cleared += 1;
      y += 1;
    }
  }

  if (cleared > 0) {
    lines += cleared;
    score += SCORE_TABLE[cleared] * level;
    level = Math.floor(lines / 10) + 1;
    dropMs = Math.max(120, 1000 - (level - 1) * 90);
    updateHud();
  }
}

function spawnNext() {
  current = nextPiece || randomPiece();
  nextPiece = randomPiece();

  if (collides(current, 0, 0)) {
    gameOver = true;
    overlay.classList.remove('hidden');
    overlayTitle.textContent = 'Game Over';
    overlaySub.textContent = 'R を押してリスタート';
  }
}

function lockAndContinue() {
  merge(current);
  clearLines();
  spawnNext();
}

function move(dx) {
  if (!collides(current, dx, 0)) current.x += dx;
}

function softDrop() {
  if (!collides(current, 0, 1)) {
    current.y += 1;
  } else {
    lockAndContinue();
  }
}

function hardDrop() {
  while (!collides(current, 0, 1)) current.y += 1;
  lockAndContinue();
}

function rotate() {
  const rotated = rotateMatrix(current.matrix);
  if (!collides(current, 0, 0, rotated)) {
    current.matrix = rotated;
    return;
  }

  // Simple wall kick
  if (!collides(current, -1, 0, rotated)) {
    current.x -= 1;
    current.matrix = rotated;
  } else if (!collides(current, 1, 0, rotated)) {
    current.x += 1;
    current.matrix = rotated;
  }
}

function drawCell(ctx, x, y, color, size) {
  const px = x * size;
  const py = y * size;
  ctx.fillStyle = color;
  ctx.fillRect(px + 1, py + 1, size - 2, size - 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(px + 3, py + 3, size - 6, 4);
}

function drawBoard() {
  boardCtx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

  boardCtx.fillStyle = '#090d17';
  boardCtx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);

  // Grid
  boardCtx.strokeStyle = 'rgba(255,255,255,0.07)';
  for (let x = 0; x <= COLS; x += 1) {
    boardCtx.beginPath();
    boardCtx.moveTo(x * BLOCK, 0);
    boardCtx.lineTo(x * BLOCK, ROWS * BLOCK);
    boardCtx.stroke();
  }
  for (let y = 0; y <= ROWS; y += 1) {
    boardCtx.beginPath();
    boardCtx.moveTo(0, y * BLOCK);
    boardCtx.lineTo(COLS * BLOCK, y * BLOCK);
    boardCtx.stroke();
  }

  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      const type = board[y][x];
      if (type) drawCell(boardCtx, x, y, COLORS[type], BLOCK);
    }
  }

  if (current) {
    for (let y = 0; y < current.matrix.length; y += 1) {
      for (let x = 0; x < current.matrix[y].length; x += 1) {
        if (!current.matrix[y][x]) continue;
        const bx = current.x + x;
        const by = current.y + y;
        if (by >= 0) drawCell(boardCtx, bx, by, COLORS[current.type], BLOCK);
      }
    }
  }
}

function drawNext() {
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  nextCtx.fillStyle = '#090d17';
  nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
  if (!nextPiece) return;

  const size = 24;
  const matrix = nextPiece.matrix;
  const offsetX = Math.floor((nextCanvas.width - matrix[0].length * size) / 2 / size);
  const offsetY = Math.floor((nextCanvas.height - matrix.length * size) / 2 / size);

  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {
      if (matrix[y][x]) drawCell(nextCtx, x + offsetX, y + offsetY, COLORS[nextPiece.type], size);
    }
  }
}

function updateHud() {
  scoreEl.textContent = String(score);
  linesEl.textContent = String(lines);
  levelEl.textContent = String(level);
}

function resetGame() {
  initBoard();
  score = 0;
  lines = 0;
  level = 1;
  dropMs = 1000;
  dropAcc = 0;
  paused = false;
  gameOver = false;
  nextPiece = randomPiece();
  spawnNext();
  updateHud();
  overlay.classList.add('hidden');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  overlay.classList.toggle('hidden', !paused);
  overlayTitle.textContent = 'Pause';
  overlaySub.textContent = 'P で再開';
}

function loop(ts = 0) {
  const dt = ts - lastTime;
  lastTime = ts;

  if (!paused && !gameOver) {
    dropAcc += dt;
    if (dropAcc >= dropMs) {
      dropAcc = 0;
      softDrop();
    }
  }

  drawBoard();
  drawNext();
  requestAnimationFrame(loop);
}

window.addEventListener('keydown', (e) => {
  const k = e.key;
  if (k === 'r' || k === 'R') {
    resetGame();
    return;
  }

  if (k === 'p' || k === 'P') {
    togglePause();
    return;
  }

  if (paused || gameOver || !current) return;

  if (k === 'ArrowLeft') move(-1);
  if (k === 'ArrowRight') move(1);
  if (k === 'ArrowDown') softDrop();
  if (k === 'ArrowUp') rotate();
  if (k === ' ') {
    e.preventDefault();
    hardDrop();
  }
});

resetGame();
requestAnimationFrame(loop);
