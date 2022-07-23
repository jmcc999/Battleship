

console.log("BATTLESHIP!")
//create classes board, ships, spaces, game, initiate
class Board {

  constructor(rows, columns, numShip) {

    this.ships = []
    this.cells = []
    this.numShip = numShip
    this.shipSpaces = 0
    this.rows = rows
    this.columns = columns
    for (let row = 0; row < rows; row ++) {
      this.cells[row] = []//make array of cells
      for (let column = 0; column < columns; column++) {
        this.cells[row][column] = new Space(row, column)
      }
    }
  }
  create(table, game, currentPlayer, cantClick) {
    table.innerHTML = ""//remove existing cells
    // need to add letter a row here

    let num = 1
    for(let row of this.cells) {
      let tr = document.createElement("tr")
      let th = document.createElement("th")
      th.innerText= num
      tr.appendChild(th)
      num++
      for (let cell of row) {
        let td = document.createElement("td")
        if(currentPlayer && cell.hasShip)
        td.classList.add("ship")
        if (cell.isHit && !cell.hasShip)
        td.classList.add("miss")
				if (cell.isHit && cell.hasShip) td.classList.add("hit")
				if (!cantClick) {//give each cell its own event listener
          td.addEventListener("click", e => game.clickSpace(cell, currentPlayer))
        }
        tr.appendChild(td)
      }
    table.appendChild(tr)
   }
 }
  // create ship object that updates this.ships & this.spaces
  placeShip(length, row, column, isVertical) {
    // console.log("yar")
    if (this.checkBorder(length, row, column, isVertical)) {
    let ship = new Ship(length, row, column, isVertical)
    let coords = ship.listIntersecting()
    if (this.intersects(coords)) {
      return "Another ship is in this location"
    }
    this.ships.push(ship)
    this.shipSpaces += length
    for (let coord of coords) {
      this.cells[coord[0]][coord[1]].hasShip = true
    }
    return true
   }else{
    return "This would go off the edge of the board. Try again."
  }
 }

  checkBorder(length, row, column, isVertical) {
    if (length > 1) {
      if (isVertical) {
        if (row+length > this.rows) return false
      } else {
        if (column+length > this.columns) return false
      }
    }
    return true
  }
  //if a space intersects a ship
  intersects(coords) {
		for (let coord of coords) {
			if (this.cells[coord[0]][coord[1]].hasShip) return true
		}
		return false
	}


  //find winner on this board return if all shipspaces have been Hit
  win() {
    // console.log("WINNER WINNER CHICKEN DINNER!")
    return this.shipSpaces == 0
    }
  }

//

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
class Ship {
  //makes ship obj at a specific place horizontally or vertically
  constructor(length, row, column, isVertical) {
    this.length = length
    this.row = row
    this.column = column
    this.isVertical = isVertical
  }
  listIntersecting() {
		let coords = []
		if (this.isVertical) {
			for (let i = 0; i < this.length; i++) {
				coords.push([this.row+i, this.column])
			}
		} else { // Horizontal
			for (let i = 0; i < this.length; i++) {
				coords.push([this.row, this.column+i])
			}
		}
		return coords
	}
}

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
    this.createBoards(false)
    this.isVertical = false
    for (let radio of document.getElementsByName("dir")) {
      radio.addEventListener("change", e => {
        if (e.target.checked) this.isVertical = e.target.value == "true"
      })
    }
   document.getElementById("switch-turn").addEventListener("click", e => {
		if (this.isSetup) {
      this.blankBoards()
      document.getElementById("switch-turn").style.display = "none";
      let modal = document.getElementById("modal")
      modal.style.display = "block"
      let time = 5
      document.getElementById("turn-switch-time").innerText = time;
      this.turnTimer = setInterval(() => {
        time--
        document.getElementById("turn-switch-time").innerText = time;
        if (time <= 0) this.switchTurns()
      }, 1000)
    }else { // Switch to second player placing their ships
      this.numShipsPlaced = 0
      this.turn = true
      document.getElementById("switch-turn").style.display = "none"
      document.getElementById("dir-container").style.display = ""
      this.createBoards(false)
    }
  })
  document.getElementById("switch-now").addEventListener("click", e => this.switchTurns())
  document.getElementById("play-again").addEventListener("click", e => window.location.reload())
 }

 switchTurns() {
   modal.style.display = "none"
   this.turn = !this.turn
   this.createBoards(false)
   clearInterval(this.turnTimer)
   this.msg( "Attack a space on the other board.")
 }

  blankBoards() {
		this.board0.create(document.getElementById("board0"), this, false, true)
		this.board1.create(document.getElementById("board1"), this, false, true)
	}
  //onlyu shows ships on current players board
  createBoards(cantClick) {
		this.board0.create(document.getElementById("board0"), this, !this.turn, cantClick);
		this.board1.create(document.getElementById("board1"), this, this.turn, cantClick);
	}
  //handles the space obj one either board being clicked
  clickSpace(cell, isCurrentPlayer) {
		if (this.isSetup) {
			if (!isCurrentPlayer && !cell.isHit) {
				cell.isHit = true;
				if (cell.hasShip) {
					let board = this.turn ? this.board0 : this.board1;
					this.msg("Hit!");
					board.shipSpaces--;
					if (board.checkWin()){
						this.gameEnd();
					}
					else {
						this.createBoards(true);
						document.getElementById("switch-turn").style.display = "";
					}
				}
				else {
					this.createBoards(true);
					document.getElementById("switch-turn").style.display = "";
					this.msg("Miss.")
				}
			}
		}
		else if (isCurrentPlayer) { // During setup phase, you click your own board
			this.newShip(cell);
		}
	}
  newShip(cell) {
		let board = this.turn ? this.board1 : this.board0
		let shipLength = this.numShips - this.numShipsPlaced
		let placedShip = board.placeShip(shipLength, cell.row, cell.col, this.isVertical)
		if (placedShip !== true) { // bad location
			this.msg(placedShip)
			this.renderBoards(false)
		}
		else if (++this.numShipsPlaced < this.numShips) { // good spot and still more ships to place
			this.renderBoards(false)
		}
		else { // Last ship placed
			this.msg("Ship placement complete")
			this.createBoards(true)
			document.getElementById("dir-container").style.display = "none"
			document.getElementById("switch-turn").style.display = ""
			if (this.board0.ships.length == this.board1.ships.length) { // Both players have placed their ships
				this.isSetup = true
			}
		}
	}
  //display a message
  msg(message) {
    document.getElementById("message").innerHTML = message
  }
  gameEnd() {
		this.msg("You win!!!");
		this.board0.render(document.getElementById("board0"), this, true, true)
		this.board1.render(document.getElementById("board1"), this, true, true)
		document.getElementById("switch-turn").style.display = "none"
		document.getElementById("play-again").style.display = ""
	}
}



class Execute {

  constructor() {
    this.numShips = 5
    this.rows = 9
    this.columns = 9
    //event listener to switch from menu to game board
    document.getElementById("complete").addEventListener("click", e => this.initiate());
    }
//begins game
  initiate() {
    document.getElementById("menu").style.display = "none"
		document.getElementById("controls").style.display = ""
		document.getElementById("both_boards").style.display = ""
		document.getElementById("switch-turn").style.display = "none"
		this.game = new Game(this.rows, this.columns, this.numShips)
  }
}
