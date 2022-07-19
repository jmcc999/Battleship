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
    this.rows = rows
    this.cols = cols
    for (let row = 0; row < rows; row ++) {
      this.cells[row] = []
      for (let col = 0; col < cols; col++) {
        this.cells[row][col] = new Space(row, col)
      }

    }
  }
  placeShip(length, row, col, isVertical) {
    console.log("yar")
  }
  create(table, game, isCurrentPlayer, preventClicking) {
		table.innerHTML = ""; // Remove any existing cells

	// 	// Add letter row
	// 	let letter = 'A';
	// 	let tr = document.createElement("tr");
	// 	let th = document.createElement("th");
	// 	tr.appendChild(th);
	// 	for (let cell of this.cells[0]) {
	// 		let th = document.createElement("th");
	// 		th.innerText = letter;
	// 		tr.appendChild(th);
	// 		letter = String.fromCharCode(letter.charCodeAt(0) + 1); // Increment letter
	// 	}
	// 	table.appendChild(tr)
  //   let num = 1;
	// 	for (let row of this.cells) {
	// 		let tr = document.createElement("tr");
  //
	// 		// Add number column
	// 		let th = document.createElement("th");
	// 		th.innerText = num;
	// 		tr.appendChild(th);
	// 		num++;
  //
	// 		for (let cell of row) {
	// 			let td = document.createElement("td");
	// 			if (isCurrentPlayer && cell.hasShip) td.classList.add("ship");
	// 			if (cell.isHit && !cell.hasShip) td.classList.add("miss");
	// 			if (cell.isHit && cell.hasShip) td.classList.add("hit");
	// 			if (!preventClicking) {
	// 				// Each cell has its own event listenser that listens for clicks on itself
	// 				td.addEventListener('click', e => game.clickSpace(cell, isCurrentPlayer));
	// 			}
	// 			tr.appendChild(td);
	// 		}
	// 		table.appendChild(tr);
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

  constructor(row, col) {

    this.row = row
    this.col = col
    this.hit = false
    this.hasShip = false
  }
}
console.log(Board)
let b1 = new Board()
b1.placeShip()
