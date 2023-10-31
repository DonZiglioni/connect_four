let player1;
let player2;


class Game {
  constructor(height, width, p1Color, p2Color) {
    this.height = height;
    this.width = width;
    this.board = [];
    this.player1 = new Player(1, p1Color)
    this.player2 = new Player(2, p2Color)
    this.currPlayer = this.player1.id;
    this.gameOver = false;

    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
    const board = document.getElementById('board');
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);
    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }

    this.findSpotForCol = function (x) {
      for (let y = this.height - 1; y >= 0; y--) {
        if (!this.board[y][x]) {
          return y;
        }
      }
      return null;
    }
    this.placeInTable = function (y, x) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.classList.add(`p${this.currPlayer}`);
      piece.style.top = -50 * (y + 2);
      if (this.currPlayer === 1) {
        piece.style.backgroundColor = this.player1.color
      } else {
        piece.style.backgroundColor = this.player2.color
      }
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }

    this.checkForWin = function () {
      const _win = (cells) => {
        return cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.height &&
            x >= 0 &&
            x < this.width &&
            this.board[y][x] === this.currPlayer
        );
      }

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    }
    this.endGame = function (msg) {
      this.gameOver = true;
      alert(msg);
    }
  }
  // End of Constructor
  handleClick = (evt) => {
    if (this.gameOver) {
      alert("This game is over!  Start a new game to try again...")
      return
    }
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    // switch players
    this.currPlayer = this.currPlayer === 1 ? 2 : 1;
  }

}

class Player {
  constructor(playerNumber, color) {
    this.id = playerNumber
    this.color = color
  }
}

let isGame = false

const startButton = document.querySelector('#start')
startButton.addEventListener('click', () => {
  if (!isGame) {
    let color1 = document.querySelector('#player1Color').value
    let color2 = document.querySelector('#player2Color').value
    new Game(7, 6, color1, color2)
    isGame = true
    startButton.innerText = "End Game"
  } else {
    location.reload()
  }
})


