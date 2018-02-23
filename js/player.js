/* Objects with game shapes (a cross and a notch)
*/
const GAME_SHAPES = { X: 1, O: 0 };

/* Secondary function to obtain a random number
*/
const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/* Object representing the player
    id - random number (in our case 1 or 2)
    name - player name (if specified), 
        GoodKat if other is not specified and PDP-11 if Computer plays
    shape - game figure
    move - does a player make a move (X-shape moves first by default)
    score - player score
    isAI - computer or player
*/
const Player = function (id, name, shape, isAI) {
    this.id = id;
    this.name = name;
    this.shape = shape;
    this.move = shape === GAME_SHAPES.X;
    this.score = 0;
    this.isAI = isAI;
};
/* Secondary function to obtain a random cell from 0 to the size of the playing board
*/
Player.prototype.getRandomIndex = (max, min = 0) => {
    return getRandom(min, max);
};
/* The recursive function to obtain a free cell for the computer's move
*/
Player.prototype.getMove = function(gameBoard) {
    let row = this.getRandomIndex(gameBoard.size - 1),
        column = this.getRandomIndex(gameBoard.size - 1);
    if(gameBoard.board[row][column] !== -1) {
        [ row, column ] = this.getMove(gameBoard);
    }
    return [ row, column ];
};
/* The logic of the computer interface of the game.
    If a computer makes the first move, the figure will be set in a random cell.
    If the computer makes a move that is less than 2 * the size of the field - 2 
	(i.e., if the winning situation could not occur according to the number of moves), 
	then a random non-occupied cell returns.
    If the winning situation could occur, then the computer looks for its prospects 
	for winning and returns the winning cell. If there is no chance of winning, 
	then the computer looks for the opponent's winning cell and tries to stop him.
    If no interesting cells are found, then a random unoccupied cell will return.
*/
Player.prototype.calculateMove = function(gameBoard, moves) {   
    if(moves === 0) {
        return [ 
            this.getRandomIndex(gameBoard.size - 1), this.getRandomIndex(gameBoard.size - 1) 
        ];
    }
    if(moves + 1 < (2 * gameBoard.size - 2)) { return this.getMove(gameBoard); }
    // Find by win
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            const board = gameBoard.copyBoard();
            if(board[i][j] === -1) {
                board[i][j] = this.shape;
                const myWin = gameBoard.check(board);
                if(myWin) { return [ i, j ]; }
            }
        }
    }
    // Find opponent's win
    for (let i = 0; i < gameBoard.size; i++) {
        for (let j = 0; j < gameBoard.size; j++) {
            const board = gameBoard.copyBoard();
            if(board[i][j] === -1) {
                board[i][j] = this.shape === GAME_SHAPES.X 
                    ? GAME_SHAPES.O 
                    : GAME_SHAPES.X;
                const enemyWin = gameBoard.check(board);
                if(enemyWin) { return [ i, j ]; }
            }
        }
    }
    return this.getMove(gameBoard);
};
// Enlarge account
Player.prototype.incScore = function(score = 1) {
    this.score += score;
};