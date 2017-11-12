
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
      let x = i * xGap + 24
      grid.push([])
      for (var j = 0; j < size; j++) {
        grid[i].push(new GridPoint(x, j * yGap + 8))
      }
    }
    return grid
  }

  generateTerrain(){
    //TODO places empty unselectable towers to be used as permanent walls
  }

  findShortestPath(startX, startY, endX, endY){
    //give it a start and an end point and it will return null or an array of tuples{x,y}
    let startNode = this.generateNodeGraph(startX, startY, endX, endY)
    return aStarAlg.shortestPath(startNode)
  }

  //A* graph generator
  generateNodeGraph(startX, startY, endX, endY){
    let startNode = undefined
    let graphMold = []
    //create all nodes
    for(var i = 0;i<this.grid.length;i++){
      graphMold.push([])
      for(var j = 0; j<this.grid[i].length;j++){
        let currentPoint = this.getPoint(i,j)

        if(!currentPoint.isOccupied()){
          let newNode = new aStarNode(this.getPoint(i,j).x,this.getPoint(i,j).y)
          graphMold[i].push(newNode)
          if(newNode.x == startX && newNode.y == startY){
            startNode = graphMold[i][j]
          }else if(newNode.x == endX && newNode.y == endY){
            graphMold[i][j].setEnd()
          }
        }
      }
    }

    //attach all nodes
    for(var i = 0;i<this.grid.length;i++){
      for(var j = 0; j<this.grid[i].length;j++){
        let currentNode = graphMold[i][j]
        if(currentNode!==undefined){
          if(i>0){
            if(graphMold[i-1][j]!==undefined){
              currentNode.addPath(new aStarPath(graphMold[i-1][j],1))
            }
          }
          if(i<this.grid.length-1){
            if(graphMold[i+1][j]!==undefined){
              currentNode.addPath(new aStarPath(graphMold[i+1][j],1))
            }
          }
          if(j>0){
            if(graphMold[i][j-1]!==undefined){
              currentNode.addPath(new aStarPath(graphMold[i][j-1],1))
            }
          }
          if(j<this.grid[i].length-1){
            if(graphMold[i][j+1]!==undefined){
              currentNode.addPath(new aStarPath(graphMold[i][j+1],1))
            }
          }
        }
      }
    }
    return startNode
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