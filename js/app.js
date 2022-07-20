// function createBoard(grid, squares) {
//     for (let i = 0; i < width*width; i++) {
//       atually make a class with the board in it
//     }
//   }
//
//

console.log("you sunk my BATTLESHIP!")

class Board {

  constructor(rows, columns, numShip) {

    this.ships = []
    this.cells = []
    this.numShip = numShip
    this.shipSpaces = 0
    this.rows = rows
    this.columns = columns
    for (let row = 0; row < rows; row ++) {
      this.cells[row] = []
      for (let column = 0; column < columns; column++) {
        this.cells[row][column] = new Space(row, column)
      }
    }
  }
  placeShip(length, row, column, isVertical) {
    console.log("yar")
  }


  //find winner on this board return if all shipspaces have been Hit
  win() {
    console.log("WINNER WINNER CHICKEN DINNER!")
    return this.shipSpaces == 0
    }
  }

//
//i am going to need to add letter a row
// Increment letter
class Space {

  constructor(row, column) {

    this.row = row
    this.column = column
    this.hit = false
    this.hasShip = false
  }
}
// let b1 = new Board()
// b1.placeShip()
// b1.win()

class Game {

  constructor(rows, columns, numShip){
    this.rows = rows
    this.columns = columns
    this.numShip = numShip
    this.turn = false
    this.setup = false
    this.numShipsPlaced= 0
    this.board0 = new Board(rows, columns, this.numShips)
    this.board1 = new Board(rows, columns, this.numShips)

  }
  blankBoards() {
		this.board0.render(document.getElementById("board0"), this, false, true);
		this.board1.render(document.getElementById("board1"), this, false, true);
	}
}


let game1 = new Game(10, 10, 10)
game1.blankBoards()
// console.log(board0)
// console.log(game1)

class Execute {
  constructor() {
    this.numShips = 1
    this.rows = 9
    this.columns = 9
  }
  initiate() {
    document.getElementById("grid-display").style.display = "";
    this.game = new Gameplay(this.rows, this.cols, this.numShips)
  }
}
