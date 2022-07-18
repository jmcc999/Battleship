// function createBoard(grid, squares) {
//     for (let i = 0; i < width*width; i++) {
//       atually make a class with the board in it
//     }
//   }
//
//

console.log("you sunk my BATTLESHIP!")

class Board {

  constructor(rows, cols, numShip) {

    this.ships = []
    this.cells = []
    this.numShip = numShip
    this.shipSPaces = 0
    this.rows = browserthis.cols = colors
    for (let row = 0; row < rows; row ++) {
      this.cells[row][col] = new Space(row,col)
    }
  }
}

class Space {

  constructor(row, col) {

    this.row = row
    this.col = col
    this.hit = false
    this.hasShip = false
  }
}
// console.log()

		 // Remove any existing cells

		// Add letter row
		let letter = 'A';
		let tr = document.createElement("tr");
		let th = document.createElement("th");
		tr.appendChild(th);
		for (let cell of this.cells[0]) {
			let th = document.createElement("th");
			th.innerText = letter;
			tr.appendChild(th);
			letter = String.fromCharCode(letter.charCodeAt(0) + 1); // Increment letter
		}
		table.appendChild(tr);
