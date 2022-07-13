console.log("you sunck my battleship!")



//set grid size variables

let p1gridSize = prompt("select grid size")//bigger grid = higher difficulty
let p2gridSize =prompt("select grid size")
//write an array of an arrays

const createGrid = (size) =>
{
  let grid = []
  for (let i = 0; i < size; i++){//change to for of loops?
    grid[i] = []
    for (let j=0; j < size; j++){
      grid[i][j] = "-"
    }
  }
  return grid
}
console.log(grid)
//focus on MVP
