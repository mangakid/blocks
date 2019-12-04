const cvs = document.getElementById("blocks");
const scoreElement = document.getElementById("score");
const ctx = cvs.getContext("2d");
const SQ = 20;
const drawSquare = (x, y, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x * SQ, y * SQ, SQ, SQ);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
};

// Create board
const ROWS = 20;
const COLUMNS = 10;
const VACANT = "white";

const board = [];
for (let r = 0; r < ROWS; r += 1) {
  board[r] = [];
  for (let c = 0; c < COLUMNS; c += 1) {
    board[r][c] = VACANT;
  }
}

const drawBoard = () => {
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLUMNS; c += 1) {
      drawSquare(c, r, board[r][c]);
    }
  }
};

drawBoard();

const PIECES = [
  [Z, "red"],
  [S, "green"],
  [T, "yellow"],
  [O, "blue"],
  [L, "purple"],
  [I, "cyan"],
  [J, "orange"]
];

let p = randomPiece();

function Piece(block, color) {
  this.block = block;
  this.blockN = 0;
  this.activeBlock = this.block[this.blockN];
  this.color = color;
  this.x = 3;
  this.y = -2;
}

function randomPiece() {
  let r = (randomN = Math.floor(Math.random() * PIECES.length));
  return new Piece(PIECES[r][0], PIECES[r][1]);
}

Piece.prototype.fill = function(color) {
  const { length } = this.activeBlock;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; c += 1) {
      if (this.activeBlock[r][c]) {
        drawSquare(this.x + c, this.y + r, color);
      }
    }
  }
};

Piece.prototype.draw = function() {
  this.fill(this.color);
};

Piece.prototype.unDraw = function() {
  this.fill(VACANT);
};

Piece.prototype.collision = function(x, y, piece) {
  const { length } = piece;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; c += 1) {
      if (!piece[r][c]) {
        continue;
      }
      let newX = this.x + c + x;
      let newY = this.y + r + y;
      if (newX < 0 || newX >= COLUMNS || newY >= ROWS) {
        return true;
      }
      if (newY < 0) {
        continue;
      }
      if (board[newY][newX] != VACANT) {
        return true;
      }
    }
  }
  return false;
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0, 1, this.activeBlock)) {
    this.unDraw();
    this.y += 1;
    this.draw();
  } else {
    this.lock();
    p = randomPiece();
  }
};

Piece.prototype.moveLeft = function() {
  if (!this.collision(-1, 0, this.activeBlock)) {
    this.unDraw();
    this.x -= 1;
    this.draw();
  }
};

Piece.prototype.moveRight = function() {
  if (!this.collision(1, 0, this.activeBlock)) {
    this.unDraw();
    this.x += 1;
    this.draw();
  }
};

Piece.prototype.rotate = function() {
  let nextPattern = this.block[(this.blockN + 1) % this.block.length];
  let kick = 0;
  if (this.collision(0, 0, nextPattern)) {
    if (this.x > COLUMNS / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }
  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.x += kick;
    this.blockN = (this.blockN + 1) % this.block.length;
    this.activeBlock = this.block[this.blockN];
    this.draw();
  }
};

let score = 0;
Piece.prototype.lock = function() {
  const { length } = this.activeBlock;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; c += 1) {
      if (!this.activeBlock[r][c]) {
        continue;
      }
      if (this.y + r < 0) {
        gameOver = true;
        alert("GAME OVER");
        break;
      }
      board[this.y + r][this.x + c] = this.color;
    }
  }
  // remove full rows
  for (let r = 0; r < ROWS; r += 1) {
    let isRowFull = true;
    for (let c = 0; c < COLUMNS; c += 1) {
      isRowFull = isRowFull && board[r][c] !== VACANT;
    }
    if (isRowFull) {
      for (let y = r; y > 1; y--) {
        for (let c = 0; c < COLUMNS; c += 1) {
          board[y][c] = board[y - 1][c];
        }
      }
      for (let c = 0; c < COLUMNS; c += 1) {
        board[0][c] = VACANT;
      }
      score += 10;
    }
  }
  drawBoard();

  // update score
  scoreElement.innerHTML = score;
};

function CONTROL(event) {
  switch (event.keyCode) {
    case 37: {
      p.moveLeft();
      break;
    }
    case 38: {
      p.rotate();
      break;
    }
    case 39: {
      p.moveRight();
      break;
    }
    case 40: {
      p.moveDown();
      break;
    }
  }
}

document.addEventListener("keydown", CONTROL);
const pieceColor = "orange";
for (let r = 0; r < p.length; r += 1) {
  for (let c = 0; c < p.length; c += 1) {
    if (p[r][c]) {
      drawSquare(c, r, pieceColor);
    }
  }
}

let dropStart = Date.now();
let gameOver = false;

function drop() {
  let now = Date.now();
  let delta = now - dropStart;
  if (delta > 1000) {
    p.moveDown();
    dropStart = Date.now();
  }
  if (!gameOver) {
    requestAnimationFrame(drop);
  }
}

drop();
