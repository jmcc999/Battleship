
class Board {
	// /
	// description Represents a single player's board, storing the status of each space and ship as a 2-D array of Space objects.
	// rows The number of rows the board will have
	// cols The number of columns the board will have
	//   numShip Number of ships in the current board
	// /
	constructor(rows, cols, numShip) {

//  ships Array of ships in the current board
// 	cells 2D array of cell containing space objects
// shipSpaces of spaces/cells that are occupied by a ship
		this.ships = []
		this.cells = []
		this.numShips = numShip
		this.shipSpaces = 0
		this.rows = rows
		this.cols = cols
		for (let row = 0; row < rows; row++) {
			this.cells[row] = [] //Declaring cells as a 2-D array (a 1-D array who's elements point to another array).
			for (let col = 0; col < cols; col++) {
				this.cells[row][col] = new Space(row, col)
			}
		}
	}
//   current state of the board to an HTML table element, optionally showing ships and allowing clicking
//  The table to render the board to
//  to use the clickSpace method of
// 	for whether all ship locations should be visible
// to restrict a player to click again
	render(table, game, isCurrentPlayer, preventClicking) {
		table.innerHTML = "" // Remove any existing cells
// add letter row
		let num = 1
		for (let row of this.cells) {
			let tr = document.createElement("tr")
			// Add number column
			let th = document.createElement("th")
			th.innerText = num
			tr.appendChild(th)
			num++
			for (let cell of row) {
				let td = document.createElement("td")
				if (isCurrentPlayer && cell.hasShip) td.classList.add("ship")
				if (cell.isHit && !cell.hasShip) td.classList.add("miss")
				if (cell.isHit && cell.hasShip) td.classList.add("hit")
				if (!preventClicking) {
					// Each cell has its own event listenser that listens for clicks on itself
					td.addEventListener('click', e => game.clickSpace(cell, isCurrentPlayer))
				}
				tr.appendChild(td)
			}
			table.appendChild(tr)
		}
	}
	//  confirm coordinates are within bounds of board
// Creates a new Ship object and updates this.ships and this.spaces accordingly
// How many spaces long the ship should be
// The row coordinate of the top end of the ship
//  The col coordinate of the left end of the ship
// 	Direction of ship (false = horizontal)
//
	placeShip(length, row, col, isVertical) {
		if (this.checkBoundaries(length, row, col, isVertical)) {
			let ship = new Ship(length, row, col, isVertical)
			let coords = ship.listIntersecting()
			if (this.isIntersecting(coords)) {
				return "This location would overlap with another ship. Try again."
			}
			this.ships.push(ship)
			this.shipSpaces += length
			for (let coord of coords) {
				this.cells[coord[0]][coord[1]].hasShip = true
			}
			return true

		} else {
			return "This location would go off the edge of the board. Try again."
		}
	}

	checkBoundaries(length, row, col, isVertical) {
		if (length > 1) {
			if (isVertical) {
				if (row+length > this.rows) return false
			} else {
				if (col+length > this.cols) return false
			}
		}
		return true
	}
 // Determines whether the game has been won on this board
 // If all ship spaces on this board have been sunk

	checkWin() {
		return this.shipSpaces == 0
	}
// Whether the given row, col coordinates intersect the ship
	isIntersecting(coords) {
		for (let coord of coords) {
			if (this.cells[coord[0]][coord[1]].hasShip) return true
		}
		return false
	}
}

class Execute {
//  Sets up the game with the user selected number of ships. Constructor create event listeners on the game setup menu
    constructor() {
	// numShips  The number of ships each player will have
 // row The number of rows each board will have
 // 		 cols the number of columns each board will have
	// Future enhancement Allow the user to select the size of the board
		this.rows = 9
		this.cols = 9
		this.numShips = 3
		// Setting up the event for a click to change the menu for the board
		document.getElementById("complete").addEventListener("click", e => this.initGame())
    }
 // Sets up the player names and number of ships, then begins the game.

	initGame() {
		document.getElementById("menu").style.display = "none"
		document.getElementById("controls").style.display = ""
		document.getElementById("both_boards").style.display = ""
		document.getElementById("switch-turn").style.display = "none"
		this.game = new Game(this.rows, this.cols, this.numShips)
	}
}

class Game {

// Manages the boards and user interaction during gameplay (ship placement and attacking)
//  The number of rows the boards have
// The number of columns the boards have
// 	The number of ships each player has

	constructor(rows, cols, numShip) {

		this.rows = rows
		this.cols = cols
		this.numShips = numShip// be able to change numships later

		this.turn = false
		this.isSetup = false
		this.numShipsPlaced = 0

		this.board0 = new Board(rows, cols, this.numShips)//upgrade:be able to change numships
		this.board1 = new Board(rows, cols, this.numShips)
		this.renderBoards(false)

		this.isVertical = false
		for (let radio of document.getElementsByName("dir")) {
			radio.addEventListener("change", e => {
				if (e.target.checked) this.isVertical = e.target.value == "true"
			})
		}

		document.getElementById("switch-turn").addEventListener("click", e => {
			if (this.isSetup) {

				this.blankBoards()
				document.getElementById("switch-turn").style.display = "none"
				let modal = document.getElementById("modal")
				modal.style.display = "block"
				let time = 5
				document.getElementById("turn-switch-time").innerText = time
				this.turnTimer = setInterval(() => {
					time--
					document.getElementById("turn-switch-time").innerText = time
					if (time <= 0) this.switchTurns()
				}, 1000)
			}
			else { // Switch to second player placing their ships
				this.numShipsPlaced = 0
				this.turn = true
				document.getElementById("switch-turn").style.display = "none"
				document.getElementById("dir-container").style.display = ""
				this.renderBoards(false)
			}
		})
		document.getElementById("switch-now").addEventListener("click", e => this.switchTurns())
		// Future enhancement: Reset the game properly so player names can be kept
		document.getElementById("play-again").addEventListener("click", e => window.location.reload())
	}
 // Sets up the next player's turn by hiding the turn switch modal and displaying their ships
	switchTurns() {
		modal.style.display = "none"
		this.turn = !this.turn
		this.renderBoards(false)
		clearInterval(this.turnTimer)
		this.msg( "Attack a space on the other board.")
	}

 // Render the boards, hides the ships on both boards, for use during turn switching
	blankBoards() {
		this.board0.render(document.getElementById("board0"), this, false, true)
		this.board1.render(document.getElementById("board1"), this, false, true)
	}

//  Render the boards, only showing ships on the current player's board
// preventClicking Whether to not setup the clickSpace listener on each cell
	renderBoards(preventClicking) {
		this.board0.render(document.getElementById("board0"), this, !this.turn, preventClicking)
		this.board1.render(document.getElementById("board1"), this, this.turn, preventClicking)
	}
// create the boards, showing ships on both boards, and display a victory message
	gameEnd() {
		this.msg("You win!!!")
		this.board0.render(document.getElementById("board0"), this, true, true)
		this.board1.render(document.getElementById("board1"), this, true, true)
		document.getElementById("switch-turn").style.display = "none"
		document.getElementById("play-again").style.display = ""
	}
// Handles a space being clicked on either board
// cell The Space object that was clicked
// isCurrentPlayer Whether the board that was clicked belongs to the player whose turn it currently is
	clickSpace(cell, isCurrentPlayer) {
		if (this.isSetup) {
			if (!isCurrentPlayer && !cell.isHit) {
				cell.isHit = true
				if (cell.hasShip) {
					let board = this.turn ? this.board0 : this.board1;
					this.msg("Hit!")
					board.shipSpaces--
					if (board.checkWin()){
						this.gameEnd()
					} else {
						this.renderBoards(true)
						document.getElementById("switch-turn").style.display = ""
					}
				} else {
					this.renderBoards(true)
					document.getElementById("switch-turn").style.display = ""
					this.msg("Miss.")
				}
			}
		}
		else if (isCurrentPlayer) { // During setup phase, you click your own board
			this.newShip(cell)
		}
	}
 // Places a new ship on the current player's board
 // The space the user clicked on, which will be the top/left end of the new ship
	newShip(cell) {
		let board = this.turn ? this.board1 : this.board0
		let shipLength = this.numShips - this.numShipsPlaced//future add slider to change numeShips
		let placedShip = board.placeShip(shipLength, cell.row, cell.col, this.isVertical)
		if (placedShip !== true) { // Failed to place ship in a valid location
			this.msg(placedShip)
			this.renderBoards(false)
		}
		else if (++this.numShipsPlaced < this.numShips) { // Placed successfully and still more ships to place
			this.renderBoards(false);
		}
		else { // Last ship placed
			this.msg("Ship placement complete")
			this.renderBoards(true)
			document.getElementById("dir-container").style.display = "none"
			document.getElementById("switch-turn").style.display = ""
			if (this.board0.ships.length == this.board1.ships.length) { // Both players have placed their ships
				this.isSetup = true
			}
		}
	}
	// Display a message to the current player
//
	msg(message) {
		document.getElementById("message").innerHTML = message
	}
}

class Space {
//Represents a single space on a board. Creates a Space object, defaulting to no ship and not hit
///
	constructor(row, col) {
// hasShip = any ship contains this space
// isHit =this space has been attacked (regardless of if it has a ship)
		this.row = row
		this.col = col
		this.hasShip = false
		this.isHit = false
	}
}

class Ship {
// Represents a single ship on a board. Creates a Ship object at the given size, location, and direction.
// 	length How many spaces long the ship should be
// row The row coordinate of the top end of the ship
// col The col coordinate of the left end of the ship
//  isVertical Direction of ship (false = horizontal)

	constructor(length, row, col, isVertical) {
		this.length = length
		this.row = row
		this.col = col
		this.isVertical = isVertical
	}
// An array of (row, col) pairs of coordinates

	listIntersecting() {
		let coords = []
		if (this.isVertical) {
			for (let i = 0; i < this.length; i++) {
				coords.push([this.row+i, this.col])
			}
		} else { // Horizontal
			for (let i = 0; i < this.length; i++) {
				coords.push([this.row, this.col+i])
			}
		}
		return coords
	}
}
