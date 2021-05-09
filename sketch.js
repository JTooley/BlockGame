const blockSize = 20;
const boardHeight = 20;
const boardWidth = 10;

let pieceX = 0;
let pieceY = 0;
let dropInterval = 50;
let dropCount = 0;

let board;
let score = 0;
let piece;
let gameOver = false;
let paused = false;
let totalLines = 0;
let currLevel = 1;

class Piece {
    static tetronimos = [
        [ [ 1, 1, 1, 1 ] ],
        [ [ 1, 1 ] , [ 1, 1 ] ],
        [ [ 1, 1, 0 ] , [ 0, 1, 1 ] ],
        [ [ 1, 1, 1 ] , [ 0, 1, 0 ] ],
        [ [ 1, 1, 1 ] , [ 1, 0, 0 ] ],
        [ [ 1, 1, 1 ] , [ 0, 0, 1 ] ],
    ];

    blocks;
    x;
    y;

    constructor() {
        const blockIndex = Math.floor(random(Piece.tetronimos.length));
        this.blocks = Piece.tetronimos[blockIndex];
        this.y = 0;
        this.x = boardWidth / 2
    }

    rotate() {
        let newBlocks = [];
        for (let i = this.blocks[0].length-1; i >= 0; i--) {
            newBlocks.push([]);
            for (let j = 0; j < this.blocks.length; j++) {
                newBlocks[newBlocks.length-1].push(this.blocks[j][i]);
            }
        }
        this.blocks = newBlocks;
    }
}

function resetBoard()
{
    gameOver = false;
    score = 0;
    level = 1;
    totalLines = 0;
    board = Array(boardHeight).fill(0).map(x => Array(boardWidth).fill(0))
    piece = new Piece();
}

function setup() 
{
	createCanvas(400, 400);
    resetBoard();
}

function draw()
{
    background(50);

    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            if (board[i][j] !== 0) {
                let c = color(0, 255, 0);
                fill(c);
                square(blockSize*j, blockSize*i, blockSize);
            }
        }
    }

    if (gameOver) {
        text('GAME OVER', 250, 120);
        return;
    }

    if (paused) {
        text('PAUSED', 250, 120);
        return;
    }
    
    for (let i = 0; i < piece.blocks.length; i++) {
        for (let j = 0; j < piece.blocks[i].length; j++) {
            if (piece.blocks[i][j] !== 0) {
                const x = piece.x + j;
                const y = piece.y + i;
                let c = color(0, 255, 0);
                fill(c);
                square(blockSize*x, blockSize*y, blockSize);
            }
        }
    }
    if (dropCount % dropInterval === 0)
    { 
        piece.y++;
        checkYMove();
    }
    dropCount++;

    textSize(20);
    text('Score: ', 250, 30);
    text(str(score), 250, 60);
    text('Level: ', 250, 90);
    text(str(currLevel), 350, 90);
}

function checkXMove()
{
    for (let i = 0; i < piece.blocks.length; i++) {
        for (let j = 0; j < piece.blocks[i].length; j++) {
            if (piece.blocks[i][j] !== 0) {
                if ( (piece.x + j < 0) || (piece.x + j >= boardWidth)) { 
                    return true;
                }
                if (board[piece.y + i][piece.x + j] !== 0) {
                    return true;
                }
            }
        }
    }

    return false;
}

function checkYMove()
{
    let result = false;
    for (let i = 0; i < piece.blocks.length; i++) {
        for (let j = 0; j < piece.blocks[i].length; j++) {
            if (piece.blocks[i][j] !== 0) {
                if ((piece.y + i === boardHeight) || (board[piece.y + i][piece.x + j] !== 0) ) { 
                    result = true;
                    break;
                }
            }
        }
    }
    if (result) {
        for (let i = 0; i < piece.blocks.length; i++) {
            for (let j = 0; j < piece.blocks[i].length; j++) {
                if (piece.blocks[i][j] !== 0) {
                    board[piece.y + i - 1][piece.x + j] = 1;
                }
            }
        }
        checkLine();
        piece = new Piece();
        for (let i = 0; i < piece.blocks.length; i++) {
            for (let j = 0; j < piece.blocks[i].length; j++) {
                if (piece.blocks[i][j] !== 0 && board[piece.y + i][piece.x + j] !== 0) {
                    gameOver = true;
                }
            }
        }    
    }
    return result;
}

function checkLine()
{
    let numLines = 0;
    for (let i = 0; i < boardHeight; i++) {
        let line = true;
        for (let j = 0; j < boardWidth; j++) {
            if (board[i][j] === 0) {
                line = false;
                break;
            }
        }
        if (line) {
            numLines++;
            board.splice(i, 1);
            board.splice(0, 0, Array(boardWidth).fill(0));
        }
    }
    score += (numLines * 100);
    if (numLines === 4) {
        score += 500;
    }
    totalLines += numLines;
    if (totalLines >= currLevel * 10)
    {
        currLevel++;
        dropInterval-=10;
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        if (!gameOver) {
            piece.x--;
            if (checkXMove()) {
                piece.x++;
            }
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (!gameOver) {
            piece.x++;
            if (checkXMove()) {
                piece.x--;
            }
        }
    } else if (keyCode === UP_ARROW) {
        piece.rotate();
    } else if (keyCode === DOWN_ARROW) {
        if (!gameOver) {
            piece.y++;
            checkYMove();
        }
    } else if (key === ' ') {
        if (!gameOver) {
            while (!checkYMove()) {
                piece.y++;
            }
        }
    } else if (key === 'r') {
        resetBoard();
    } else if (key === 'p') {
        paused = !paused;
    }
  }