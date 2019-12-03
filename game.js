const cvs = document.getElementById("blocks");
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

const Z = [
  [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  [
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 0]
  ],
  [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0]
  ]
];

const PIECES = [
  [Z, "red"],
  [Z, "red"],
  [Z, "red"],
  [Z, "red"],
  [Z, "red"],
  [Z, "red"],
  [Z, "red"]
];

function Piece(block, color) {
  this.block = block;
  this.blockN = 0;
  this.activeBlock = this.block[this.blockN];
  this.color = color;
  this.x = 3;
  this.y = -2;
}

function randomPiece() {
  let randomN = Math.floor(Math.random() * PIECES.length);
  return new Piece(PIECES[randomN], PIECES[randomN][1]);
}

Piece.prototype.draw = function() {
  const { length } = this.activeBlock;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; c += 1) {
      if (this.activeBlock[r][c]) {
        drawSquare(this.x + c, this.y + r, this.color);
      }
    }
  }
};

Piece.prototype.unDraw = function() {
  const { length } = this.activeBlock;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; c += 1) {
      if (this.activeBlock[r][c]) {
        drawSquare(this.x + c, this.y + r, VACANT);
      }
    }
  }
};

Piece.prototype.collision = function(x, y, piece) {
  const { length } = piece;
  for (let r = 0; r < length; r += 1) {
    for (let c = 0; c < length; r += 1) {
      if (!piece[r][c]) {
        continue;
      }
      let newX = this.x + c + x;
      let newY = this.y + r + y;
      if (newX < 0 || newX > COLUMNS || newY > ROW) {
        return true;
      }
      if (newY < 0) {
        continue;
      }
      if (board[newY][newX] !== VACANT) {
        return true;
      }
    }
  }
};

Piece.prototype.moveDown = function() {
  if (!this.collision(0, 1, this.activeBlock)) {
    this.unDraw();
    this.y += 1;
    this.draw();
  } else {
    this.lock;
    piece = randomPiece();
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
  if (!this.collision(0, 0, nextPattern)) {
    if (this.x > COLUMNS / 2) {
      kick = -1;
    } else {
      kick = 1;
    }
  }
  if (!this.collision(kick, 0, nextPattern)) {
    this.unDraw();
    this.activeBlock = nextPattern;
    this.draw();
  }
};

Piece.prototype.lock = function() {
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
};

let piece = Z[0];

function CONTROL(event) {
  switch (event.keyCode) {
    case 37: {
      piece.moveLeft();
      break;
    }
    case 38: {
      piece.rotate();
      break;
    }
    case 39: {
      piece.moveRight();
      break;
    }
    case 40: {
      piece.moveDown();
      break;
    }
  }
}

document.addEventListener("keydown", CONTROL);
const pieceColor = "orange";
for (let r = 0; r < piece.length; r += 1) {
  for (let c = 0; c < piece.length; c += 1) {
    if (piece[r][c]) {
      drawSquare(c, r, pieceColor);
    }
  }
}
