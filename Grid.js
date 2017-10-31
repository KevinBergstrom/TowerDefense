
// Grid to be used for dijkstras algorithm and board state
class Grid {
  // Initialize class with passed in grid
  constructor (game, grid) {
    this.game = game
    this.grid = grid
  }

  // Create a grid
  static createGrid(size, playerUI) {
    const width = game.width
    const height = game.height - playerUI.height

    let grid = []
    // Space out points x,y map values according to given bounds
    const xGap = width / size
    const yGap = height / size

    for (var i = 0; i < size; i++) {
      let x = i * xGap
      grid.push([])
      for (var j = 0; j < size; j++) {
        grid[i].push(new GridPoint(x, j * yGap))
      }
    }
    return grid
  }

  // Find closest grid point to cursor and return it
  getClosestPoint(mouseX, mouseY) {
    let minDist
    let closestPoint

    for (var x = 0; x < this.grid.length; x++) {
      for (var y = 0; y < this.grid.length; y++) {
        const gridPoint = this.grid[x][y]
        const xDiff = mouseX - gridPoint.getX()
        const yDiff = mouseY - gridPoint.getY()
        const distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2))
        
        if (!minDist || distance < minDist) {
          minDist = distance
          closestPoint = gridPoint
        }
      }
    }

    return closestPoint
  }

  // Returns the object at the point or returns null
  getPoint (x, y) {
    return this.grid[x][y]
  }
  // Sets the point on the grid to the object
  setPoint (value, x, y) {
    this.grid[x][y] = value
  }
  // Set point to null
  clearPoint (x, y) {
    this.grid[x][y] = null
  }
}